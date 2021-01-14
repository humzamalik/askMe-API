const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()

const Answer = require("../models/answer")
const question = require("../models/question")
const Question = require("../models/question")

router.get("/", (req, res, next) => {
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
                            answers: answers
                        })
                    })
            })
            .catch(err => {
                res.status(500).json({
                    Error: err
                })
            })
    } else {
        res.status(400).json({
            message: "Request format is invalid",
            format: "/answers?questionId=<a valid question id>"
        })
    }
})

router.post("/", (req, res, next) => {
    const args = {
        questionId: req.body.questionId,
        text: req.body.text,
        answeredBy: req.body.answeredBy
    }
    if (Object.values(args).includes(undefined)) {
        return res.status(400).json({
            Message: "Request payload is invalid. Please use attached format to post an answer",
            format: {
                "text": "An answer String",
                "answeredBy": "A valid username",
                "questionId": "A valid question id"
            }
        })
    }
    Question.findById(args.questionId)
        .exec()
        .then(question => {
            if (!question) {
                return res.status(404).json({
                    "message": "No question found against passed Id"
                })
            }
            const answer = new Answer({
                _id: new mongoose.Types.ObjectId(),
                questionId: req.body.questionId,
                text: req.body.text, // {type: String, require: true},
                answeredBy: req.body.answeredBy, // {type: String, require: true},
                dateCreated: Date.now(),
                dateUpdated: null,
                upVotes: 0,
                downVotes: 0,
                isVerified: false
            })
            answer
                .save()
                .then(result => {
                    res.status(201).json({
                        "message": "Answer posted against question id",
                        "questionId": answer.questionId

                    })
                    Question.updateOne({ _id: args.questionId }, {
                            $set: {
                                answers: question.answers + 1
                            }
                        })
                        .exec()
                })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
})

router.get("/:id", (req, res, next) => {
    const id = req.params.id
    Answer.findById(id)
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
                Error: err
            })
        })
})

router.patch("/:id", (req, res, next) => {
    res.status(200).json({
        message: "It will use to update a answer",
        id: req.params.id
    })
})

router.delete("/:id", (req, res, next) => {
    const id = req.params.id
    Answer.deleteOne({ _id: id })
        .exec()
        .then(result => {
            if (result['n'] > 0) {
                Answer.findById(id)
                    .exec()
                    .then(answer => {
                        if (answer) {
                            Question.updateOne({ _id: answer.questionId }, {
                                    $inc: {
                                        "answers": -1
                                    }
                                })
                                .exec()
                        }
                    })
            }
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
})

module.exports = router