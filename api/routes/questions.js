const express = require("express")
const mongoose = require("mongoose")
const question = require("../models/question")

const Question = require("../models/question")

const router = express.Router()

router.get("/", (req, res, next) => {
    Question.find()
        .exec()
        .then(results => {
            res.status(200).json(results)
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
})

router.post("/", (req, res, next) => {
    const question = new Question({
        _id: new mongoose.Types.ObjectId(),
        query: req.body.query,
        askedBy: req.body.askedBy
    })
    question
        .save()
        .then(result => {
            res.status(200).json({
                message: "It will use to post a question",
                postedQuestion: question
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
    Question.findById(id)
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(404).json({
                    message: 'No question found against passed id'
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
    const id = req.params.id
    Question.updateOne({ _id: id }, { $set: { 'query': req.body.query } })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
})

router.delete("/:id", (req, res, next) => {
    const id = req.params.id
    Question.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
})

module.exports = router