const mongoose = require("mongoose")

const questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    query: String, // {type: String, require: true},
    askedBy: String, // {type: String, require: true},
    dateCreated: Date,
    dateUpdated: Date,
    media: Array,
    likes: Number,
    answers: Number
})

module.exports = mongoose.model("Question", questionSchema)