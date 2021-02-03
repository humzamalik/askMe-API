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
    const args = [
        req.body.query,
        req.body.askedBy
    ]
    if (args.includes(undefined)) {
        return res.status(400).json({
            message: "Request payload is invalid. Please use attached format to post a question",
            format: {
                "query": "A String query",
                "askedBy": "A valid username"
            }
        })
    }
    Question.create({
            query: req.body.query,
            askedBy: req.body.askedBy,
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
    if (req.body.query === undefined) {
        return res.status(400).json({
            message: "Request payload is invalid. Please use attached format to post a question",
            format: {
                "query": "A String query that you want to update"
            }
        })
    }
    const id = req.params.id
    Question.updateOne({ _id: id }, {
            $set: {
                'query': req.body.query
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
                error: err
            })
        })
}


exports.delete = (req, res, next) => {
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