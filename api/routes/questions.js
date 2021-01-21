const fs = require("fs")
const multer = require("multer")
const express = require("express")
const mongoose = require("mongoose")

const Answer = require("../models/answer")
const Question = require("../models/question")
const question = require("../models/question")

const router = express.Router()

const storage = multer.diskStorage({
    destination: "./media/",
    filename: function(req, file, cb) {
        cb(null, Date.now().toString() + " " + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg']
    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error(`${file.mimetype} is'nt supported by server`), false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter: fileFilter
}).array('pictures')

const delFile = (path) => {
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
}

router.get("/", (req, res, next) => {
    Question.find() //.select("_id query askedBy dateCreated dateUpdated likes answers")
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

router.post("/", upload, (req, res, next) => {
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
        media: req.files.map(file => {
            return file.path
        }),
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
    Question.findById(id) // .select("_id query askedBy dateCreated dateUpdated likes answers")
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
    Question.findByIdAndDelete(id)
        .exec()
        .then(question => {
            if (question) {
                const paths = question.media
                paths.forEach(path => delFile);
                Answer.deleteMany({ questionId: id })
                    .exec()
                res.status(200).json({
                    message: "Question Deleted"
                })
            } else {
                res.status(404).json({
                    Message: "Question Not Found"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        })
})

module.exports = router