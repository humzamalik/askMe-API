const bcrypt = require("bcrypt")
const User = require("../models/user")
const gen_token = require("../helpers/generate_token")

exports.signup = (req, res, next) => {
    const args = [
        req.body.username,
        req.body.password,
    ]
    if (args.includes(undefined)) {
        return res.status(400).json({
            message: "Request payload is invalid. Please use attached format to create a new account",
            format: {
                "username": "An answer String",
                "password": "A valid username",
            }
        })
    }
    User.findOne({ username: req.body.username })
        .exec()
        .then(result => {
            if (result) {
                return res.status(409).json({
                    message: "Username taken. please try another one"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        User.create({
                                username: req.body.username,
                                password: hash,
                            },
                            (error, user) => {
                                if (error) {
                                    return res.status(500).json({
                                        error: err
                                    })
                                }
                                res.status(201).json({
                                    message: "User Created"
                                })
                            }
                        )
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.login = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .exec()
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Auth Failed'
                        })
                    }
                    if (result) {
                        return res.status(200).json({
                            message: 'Auth Successful',
                            token: gen_token(user.username)
                        })
                    }
                    return res.status(401).json({
                        message: 'Auth Failed'
                    })
                })
            } else {
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


exports.get_all_user = (req, res, next) => {
    User.find()
        .exec()
        .then(results => {
            res.status(200).json({
                count: results.length,
                users: results
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
}

exports.del_all_user = (req, res, next) => {
    User.deleteMany()
        .exec()
        .then(results => {
            res.status(200).json({
                count: results.length,
                results: results
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
}