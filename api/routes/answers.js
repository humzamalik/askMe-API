const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()

const Answer = require("../models/answer")

router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "It will return all answers"
    })
})

router.post("/", (req, res, next) => {
    const args = {
        questionId: req.body.questionId,
        text: req.body.text,
        answeredBy: req.body.answeredBy
    }
    if (Object.values(args).includes(undefined)){
        res.status(400).json({
            Message: "Request payload is invalid. Please use attached format to post an answer",
            format: {
                "text": "An answer String",
                "answeredBy": "A valid username",
                "questionId": "A valid question id"
            }
        })
        return
    }
    const answer = new Answer({
        _id: new mongoose.Types.ObjectId(),
        questionId : req.body.questionId,
        text: req.body.text, // {type: String, require: true},
        answeredBy: req.body.answeredBy, // {type: String, require: true},
        dateCreated: Date.now(),
        dateUpdated: null,
        upVotes: 0,
        downVotes: 0,
        isVerified: false
    })
})

router.get("/:id", (req, res, next) => {
    res.status(200).json({
        message: "It will return a answer",
        id: req.params.id
    })
})

router.patch("/:id", (req, res, next) => {
    res.status(200).json({
        message: "It will use to update a answer",
        id: req.params.id
    })
})

router.delete("/:id", (req, res, next) => {
    res.status(200).json({
        message: "It will delete a answer",
        id: req.params.id
    })
})

module.exports = router