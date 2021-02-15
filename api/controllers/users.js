import bcrypt from "bcrypt"
import User from "../models/user"
import generateToken from "../helpers/generate_token"

const signup = async(req, res, next) => {
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
    const result = await User.findOne({ username })
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
                    (error, _user) => {
                        if (error) {
                            return res.status(500).json({
                                error
                            })
                        }
                        res.status(201).json({
                            message: "User Created"
                        })
                    })
            }
        })
    }
}

const login = async(req, res, next) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
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
}


const getAll = async(req, res, next) => {
    const results = await User.find()
    res.status(200).json({
        count: results.length,
        users: results
    })
}

const delAll = async(req, res, next) => {
    const results = User.deleteMany()
    res.status(200).json({
        count: results.length,
        results
    })
}

export {
    login,
    signup,
    getAll,
    delAll
}