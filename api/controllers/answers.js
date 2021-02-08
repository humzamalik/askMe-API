const Answer = require("../models/answer")
const Question = require("../models/question")


exports.get_all = (req, res, next) => {
    if (req.query.questionId) {
        Question.findById(req.query.questionId)
            .exec()
            .then(question => {
                if (!question) {
                    return res.status(404).json({
                        "message": "No question found against passed Id"
                    })
                }
                Answer.find({ questionId: req.query.questionId })
                    .exec()
                    .then(answers => {
                        res.status(200).json({
                            question: question,
                            count: answers.length,
                            answers: answers
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
    const args = [
        req.body.questionId,
        req.body.text,
    ]
    if (args.includes(undefined)) {
        return res.status(400).json({
            message: "Request payload is invalid. Please use attached format to post an answer",
            format: {
                "text": "An answer String",
                "questionId": "A valid question id"
            }
        })
    }
    const userData = req.userData
    Question.findById(req.body.questionId)
        .exec()
        .then(question => {
            if (!question) {
                return res.status(404).json({
                    "message": "No question found against passed Id"
                })
            }
            Answer.create({
                    questionId: req.body.questionId,
                    text: req.body.text, // {type: String, require: true},
                    answeredBy: userData.username // {type: String, require: true},
                },
                (error, answer) => {
                    if (error) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    if (answer) {
                        Question.updateOne({ _id: req.body.questionId }, {
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

exports.get_one = (req, res, next) => {
    const id = req.params.id
    Answer.findById(id)
        .populate("questionId")
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
    if (!req.body.text) {
        return res.status(400).json({
            message: "Request payload is invalid. Please use attached format to update answer body",
            format: {
                "text": "A String that you want to update"
            }
        })
    }
    const id = req.params.id
    const userData = req.userData
    Answer.updateOne({ _id: id, answeredBy: userData.username }, {
            $set: {
                'text': req.body.text
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


exports.delete = (req, res, next) => {
    const id = req.params.id
    const userData = req.userData
    Answer.findOneAndDelete({ _id: id, answeredBy: userData.username })
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