const mongoose = require("mongoose")

const questionSchema = mongoose.Schema({
    query: String, // {type: String, require: true},
    askedBy: String, // {type: String, require: true},
    media: { type: Array, default: [] },
    likes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model("Question", questionSchema)