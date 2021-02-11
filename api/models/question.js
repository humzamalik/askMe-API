import mongoose from "mongoose"

const questionSchema = mongoose.Schema({
    query: String,
    askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    media: { type: Array, default: [] },
    likes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model("Question", questionSchema)