import bcrypt from "bcrypt"
import User from "../models/user"
import generateToken from "../helpers/generate_token"

exports.signup = (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({
            message: "Request payload is invalid. Please use attached format to create a new account",
            format: {
                "username": "An answer String",
                "password": "A valid username",
            }
        })
    }
    User.findOne({ username })
        .exec()
        .then(result => {
            if (result) {
                return res.status(409).json({
                    message: "Username taken. please try another one"
                })
            } else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        User.create({
                                username,
                                password: hash,
                            },
                            (error, user) => {
                                if (error) {
                                    return res.status(500).json({
                                        error
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
    const { username, password } = req.body
    User.findOne({ username })
        .exec()
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Auth Failed'
                        })
                    }
                    if (result) {
                        return res.status(200).json({
                            message: 'Auth Successful',
                            token: generateToken(user._id)
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


exports.getAll = (req, res, next) => {
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

exports.delAll = (req, res, next) => {
    User.deleteMany()
        .exec()
        .then(results => {
            res.status(200).json({
                count: results.length,
                results
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
}