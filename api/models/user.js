import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    email: { type: String, default: null },
    username: { type: String, unique: true },
    password: String,
    profilePicture: { type: String, default: null },
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)