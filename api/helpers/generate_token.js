const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config()

const generateToken = (username) => {
    return jwt.sign({
            username
        },
        process.env.SECRET_KEY, {
            expiresIn: "30d"
        }
    )
}

module.exports = generateToken