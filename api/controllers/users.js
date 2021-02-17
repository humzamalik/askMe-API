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
        try {
            const hash = await bcrypt.hash(password, 10)
            await User.create({
                username,
                password: hash,
            })
            res.status(201).json({
                message: "User Created"
            })
        } catch (error) {
            res.status(500).json({ error })
        }
    }
}

const login = async(req, res, next) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user) {
        try {
            const isValidPass = await bcrypt.compare(password, user.password)
            if (isValidPass) {
                return res.status(200).json({
                    message: 'Auth Successful',
                    token: generateToken(user._id)
                })
            } else {
                res.status(401).json({
                    message: 'Auth Failed'
                })
            }
        } catch (_error) {
            res.status(401).json({
                message: 'Auth Failed'
            })
        }
    } else {
        res.status(401).json({
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
    const results = User.deleteMany().exec()
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