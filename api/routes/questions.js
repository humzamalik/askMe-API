const express = require("express")
const mongoose = require("mongoose")
const question = require("../models/question")
const multer = require("multer")

const Question = require("../models/question")
const Answer = require("../models/answer")

const router = express.Router()

const storage = multer.diskStorage({
    destination: "./media/",
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const upload = multer({
    storage: storage
}).any('pictures')

router.get("/", (req, res, next) => {
    Question.find()
        .select("_id query askedBy dateCreated dateUpdated likes answers")
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
    if (req.body.query === undefined || req.body.askedBy === undefined) {
        res.status(400).json({
            Message: "Request payload is invalid. Please use attached format to post a question",
            format: {
                "query": "A String query",
                "askedBy": "A valid username"
            }
        })
        return
    }
    const question = new Question({
        _id: new mongoose.Types.ObjectId(),
        query: req.body.query,
        askedBy: req.body.askedBy,
        dateCreated: Date.now(),
        dateUpdated: null,
        likes: 0,
        answers: 0,
    })
    question
        .save()
        .then(result => {
            res.status(201).json({
                message: "Question posted",
                questionId: question._id
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
        .select("_id query askedBy dateCreated dateUpdated likes answers")
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
    if (req.body.query === undefined) {
        res.status(400).json({
            Message: "Request payload is invalid. Please use attached format to post a question",
            format: {
                "query": "A String query that you want to update"
            }
        })
        return
    }
    const id = req.params.id
    Question.updateOne({ _id: id }, {
            $set: {
                'query': req.body.query,
                dateUpdated: Date.now()
            }
        })
        .exec()
        .then(result => {
            res.status(201).json({
                message: "Updated"
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
})

router.delete("/:id", (req, res, next) => {
    const id = req.params.id
    Question.deleteOne({ _id: id })
        .exec()
        .then(delQuestion => {
            Answer.deleteMany({ questionId: id })
                .exec()
                .then(delAnswer => {
                    // dump
                })
            res.status(200).json({
                "Result": delQuestion
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
})

module.exports = router