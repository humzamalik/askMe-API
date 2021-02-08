const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.userData = decoded
        next()
    } catch (e) {
        return res.status(401).json({
            message: "Auth failed"
        })
    }
}