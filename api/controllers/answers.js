import Answer from "../models/answer"
import Question from "../models/question"


const getAll = async(req, res, next) => {
    const { questionId } = req.query
    if (questionId) {
        const question = await Question.findById(questionId)
        if (!question) {
            return res.status(404).json({
                "message": "No question found against passed Id"
            })
        }
        const answers = await Answer.find({ questionId })
            .populate("answeredBy", "username profilePicture -_id")
        res.status(200).json({
            question,
            count: answers.length,
            answers
        })
    } else {
        res.status(400).json({
            message: "Request format is invalid",
            format: "/answers?questionId=<a valid question id>"
        })
    }
}

const post = async(req, res, next) => {
    const { questionId, text } = req.body
    if (!questionId || !text) {
        return res.status(400).json({
            message: "Request payload is invalid. Please use attached format to post an answer",
            format: {
                "text": "An answer String",
                "questionId": "A valid question id"
            }
        })
    }
    const { userData } = req
    const question = await Question.findById(questionId)
    if (!question) {
        return res.status(404).json({
            "message": "No question found against passed Id"
        })
    }
    Answer.create({
            questionId,
            text,
            answeredBy: userData._id
        },
        (error, answer) => {
            if (error) {
                return res.status(500).json({
                    error
                })
            }
            if (answer) {
                Question.updateOne({ _id: questionId }, {
                        $inc: {
                            answers: 1
                        }
                    })
                    .exec()
                return res.status(201).json({
                    message: "Answer posted",
                    answerId: answer._id
                })
            }
        })
}

const getOne = async(req, res, next) => {
    const { id } = req.params
    const answer = await Answer.findById(id)
        .populate("answeredBy", "username profilePicture -_id")
    if (answer) {
        res.status(200).json(answer)
    } else {
        res.status(404).json({
            message: 'No answer found against passed id'
        })
    }
}

const patch = async(req, res, next) => {
    const { text } = req.body
    if (!text) {
        return res.status(400).json({
            message: "Request payload is invalid. Please use attached format to update answer body",
            format: {
                "text": "A String that you want to update"
            }
        })
    }
    const { id } = req.params
    const { userData } = req
    const result = await Answer.updateOne({ _id: id, answeredBy: userData._id }, {
        $set: {
            text
        }
    })
    if (result.n > 0) {
        res.status(201).json({
            message: "Updated"
        })
    } else {
        res.status(203).json({
            message: "Not updated"
        })
    }
}


const deleteOne = async(req, res, next) => {
    const { id } = req.params
    const { userData } = req
    const result = await Answer.findOneAndDelete({ _id: id, answeredBy: userData._id })
    if (result) {
        Question.updateOne({ _id: result.questionId }, {
            $inc: {
                answers: -1
            }
        })
        res.status(200).json({
            message: "Answer deleted"
        })
    } else {
        res.status(404).json({
            message: "Answer not found"
        })
    }
}

export {
    post,
    patch,
    getOne,
    getAll,
    deleteOne
}