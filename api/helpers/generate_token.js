const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config()

const gen_token = (user) => {
    return jwt.sign({
            username: user
        },
        process.env.SECRET_KEY, {
            expiresIn: "30d"
        }
    )
}

module.exports = gen_token