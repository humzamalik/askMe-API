const mongoose = require("mongoose")

const questionSchema = mongoose.Schema({
    query: String,
    askedBy: { type: String, ref: 'User' },
    media: { type: Array, default: [] },
    likes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model("Question", questionSchema)