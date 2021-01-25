const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

const router = express.Router()

router.post("/signup", (req, res, next) => {
    const args = [
        req.body.user,
        req.body.pass,
    ]
    if (args.includes(undefined)) {
        return res.status(400).json({
            Message: "Request payload is invalid. Please use attached format to create a new account",
            format: {
                "user": "An answer String",
                "pass": "A valid username",
            }
        })
    }
    User.find({ username: req.body.user })
        .exec()
        .then(users => {
            if (users.length >= 1) {
                return res.status(409).json({
                    Message: "Username taken. please try another"
                })
            } else {
                bcrypt.hash(req.body.pass, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            Error: err
                        })
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: '',
                            username: req.body.user,
                            password: hash,
                            dateJoined: Date.now(),
                            profilePicture: ''
                        })
                        console.log(user)
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    Message: "User Created"
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    Error: err
                                })
                            })
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
})


router.post("/login", (req, res, next) => {
    User.findOne({ username: req.body.user })
        .exec()
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.pass, user.password, (err, resu) => {
                    if (err) {
                        return res.status(401).json({
                            Message: 'Auth Failed1'
                        })
                    }
                    if (resu) {
                        const token = jwt.sign({
                                username: user.username
                            },
                            "mySecretKey", {
                                expiresIn: "10d"
                            }
                        )
                        return res.status(200).json({
                            Message: 'Auth Successful',
                            token: token
                        })
                    }
                    return res.status(401).json({
                        Message: 'Auth Failed2'
                    })
                })
            } else {
                return res.status(401).json({
                    Message: 'Auth Failed3'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
})


router.get("/", (req, res, next) => {
    User.find()
        .exec()
        .then(results => {
            res.status(200).json({
                usersLength: results.length,
                users: results
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })

})


module.exports = router