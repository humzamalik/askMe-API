const mongoose = require("mongoose")

const questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    query: String,
    askedBy: String,
    dateCreated: Date,
    dateUpdated: Date,
    likes: Number,
    answers: Number
})

module.exports = mongoose.model("Question", questionSchema)