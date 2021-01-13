const mongoose = require("mongoose")

const answerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    questionId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    text: String, // {type: String, require: true},
    answeredBy: String, // {type: String, require: true},
    dateCreated: Date,
    dateUpdated: Date,
    upVotes: Number,
    downVotes: Number,
    isVerified: Boolean
})

module.exports = mongoose.model("Answer", answerSchema)