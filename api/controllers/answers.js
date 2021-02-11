import Answer from "../models/answer"
import Question from "../models/question"


exports.getAll = (req, res, next) => {
    const { questionId } = req.query
    if (questionId) {
        Question.findById(questionId)
            .exec()
            .then(question => {
                if (!question) {
                    return res.status(404).json({
                        "message": "No question found against passed Id"
                    })
                }
                Answer.find({ questionId })
                    .populate("answeredBy", "username profilePicture -_id")
                    .exec()
                    .then(answers => {
                        res.status(200).json({
                            question,
                            count: answers.length,
                            answers
                        })
                    })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    } else {
        res.status(400).json({
            message: "Request format is invalid",
            format: "/answers?questionId=<a valid question id>"
        })
    }
}

exports.post = (req, res, next) => {
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
    Question.findById(questionId)
        .exec()
        .then(question => {
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
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.getOne = (req, res, next) => {
    const { id } = req.params
    Answer.findById(id)
        .populate("answeredBy", "username profilePicture -_id")
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(404).json({
                    message: 'No answer found against passed id'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.patch = (req, res, next) => {
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
    Answer.updateOne({ _id: id, answeredBy: userData._id }, {
            $set: {
                text
            }
        })
        .exec()
        .then(result => {
            if (result.n > 0) {
                res.status(201).json({
                    message: "Updated"
                })
            } else {
                res.status(203).json({
                    message: "Not updated"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


exports.deleteOne = (req, res, next) => {
    const { id } = req.params
    const { userData } = req
    Answer.findOneAndDelete({ _id: id, answeredBy: userData._id })
        .exec()
        .then(result => {
            if (result) {
                Question.updateOne({ _id: result.questionId }, {
                        $inc: {
                            answers: -1
                        }
                    })
                    .exec()
                res.status(200).json({
                    message: "Answer deleted"
                })
            } else {
                res.status(404).json({
                    message: "Answer not found"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}