const User = require("../models/user")
const Answer = require("../models/answer")
const Question = require("../models/question")
const delFile = require("../helpers/delete_media")


exports.get_all = (req, res, next) => {
    Question.find() //.select("_id query askedBy dateCreated dateUpdated likes answers")
        .exec()
        .then(results => {
            res.status(200).json({
                count: results.length,
                questions: results
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


exports.post = (req, res, next) => {
    const userData = req.userData
    if (!req.body.query) {
        return res.status(400).json({
            message: "query parameter required",
        })
    }
    Question.create({
            query: req.body.query,
            askedBy: userData.username,
            media: req.files ? req.files.map(file => {
                return file.path
            }) : [],
        },
        (error, question) => {
            if (error) {
                return res.status(500).json({
                    error: err
                })
            }
            res.status(201).json({
                message: "Question posted"
            })
        }
    )
}


exports.get_one = (req, res, next) => {
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
                error: err
            })
        })
}


exports.patch = (req, res, next) => {
    if (!req.body.query) {
        return res.status(400).json({
            message: "query parameter required",
        })
    }
    const id = req.params.id
    const userData = req.userData
    Question.updateOne({ _id: id, askedBy: userData.username }, {
            $set: {
                'query': req.body.query
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
    Question.findOneAndDelete({ _id: id, askedBy: userData.username })
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
                    message: "Question Not Found"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}