const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String, // {type: String, require: true},
    username: { type: String, unique: true }, // {type: String, require: true},
    password: String, // {type: String, require: true},
    dateJoined: Date,
    profilePicture: String,
})

module.exports = mongoose.model("User", userSchema)