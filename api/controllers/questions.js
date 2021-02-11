import Answer from "../models/answer"
import Question from "../models/question"
import delFile from "../helpers/delete_media"


exports.getAll = (req, res, next) => {
    Question.find()
        .populate("askedBy", 'username profilePicture -_id')
        .exec()
        .then(questions => {
            res.status(200).json({
                count: questions.length,
                questions
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


exports.post = (req, res, next) => {
    const { userData } = req
    const { query } = req.body
    if (!query) {
        return res.status(400).json({
            message: "query parameter required",
        })
    }
    Question.create({
            query,
            askedBy: userData._id,
            media: req.files ? req.files.map(file => {
                return file.path
            }) : [],
        },
        (error, question) => {
            if (error) {
                return res.status(500).json({
                    error
                })
            }
            res.status(201).json({
                message: "Question posted"
            })
        }
    )
}


exports.getOne = (req, res, next) => {
    const { id } = req.params
    Question.findById(id)
        .populate("askedBy", 'username profilePicture -_id')
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
    const { query } = req.body
    if (!query) {
        return res.status(400).json({
            message: "query parameter required",
        })
    }
    const { userData } = req
    const { id } = req.params
    Question.updateOne({ _id: id, askedBy: userData._id }, {
            $set: {
                query
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
    const { userData } = req
    const { id } = req.params
    Question.findOneAndDelete({ _id: id, askedBy: userData._id })
        .exec()
        .then(question => {
            if (question) {
                const paths = question.media
                paths.forEach(delFile);
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