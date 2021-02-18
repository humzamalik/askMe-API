import mongoose from "mongoose"

const answerSchema = mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    text: String,
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model("Answer", answerSchema)