const mongoose = require("mongoose")

const answerSchema = mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    text: String, // {type: String, require: true},
    answeredBy: String, // {type: String, require: true},
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model("Answer", answerSchema)