import jwt from "jsonwebtoken"

const generateToken = (_id) => {
    return jwt.sign({
            _id
        },
        process.env.SECRET_KEY, {
            expiresIn: "30d"
        })
}

export default generateToken