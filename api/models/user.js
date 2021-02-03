const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email: { type: String, default: null }, // {type: String, require: true},
    username: { type: String, unique: true }, // {type: String, require: true},
    password: String, // {type: String, require: true},
    profilePicture: { type: String, default: null },
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)