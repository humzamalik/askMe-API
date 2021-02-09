const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const decoded = jwt.verify(authorization, process.env.SECRET_KEY)
        req.userData = decoded
        next()
    } catch (e) {
        return res.status(401).json({
            message: "Auth failed"
        })
    }
}