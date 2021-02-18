import Answer from "../models/answer"
import Question from "../models/question"
import delFile from "../helpers/delete_media"


const getAll = async(req, res, next) => {
    try {
        const questions = await Question.find()
            .populate("askedBy", 'username profilePicture -_id')
        res.status(200).json({
            count: questions.length,
            questions
        })
    } catch (error) {
        return res.status(500).json({ error })
    }
}

const post = async(req, res, next) => {
    const { userData } = req
    const { query } = req.body
    if (!query) {
        return res.status(400).json({
            message: "query parameter required",
        })
    }
    try {
        await Question.create({
            query,
            askedBy: userData._id,
            media: req.files ? req.files.map(file => file.path) : [],
        })
    } catch {
        return res.status(500).json({ error })
    }
    res.status(201).json({
        message: "Question posted"
    })
}


const getOne = async(req, res, next) => {
    const { id } = req.params
    try {
        const result = await Question.findById(id)
            .populate("askedBy", 'username profilePicture -_id')
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(404).json({
                message: 'No question found against passed id'
            })
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}


const patch = async(req, res, next) => {
    const { query } = req.body
    if (!query) {
        return res.status(400).json({
            message: "query parameter required",
        })
    }
    const { userData } = req
    const { id } = req.params
    try {
        const result = await Question.updateOne({ _id: id, askedBy: userData._id }, {
            $set: {
                query
            }
        })
        if (result.n > 0) {
            res.status(201).json({
                message: "Updated"
            })
        } else {
            res.status(203).json({
                message: "Not updated"
            })
        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}


const deleteOne = async(req, res, next) => {
    const { userData } = req
    const { id } = req.params
    try {
        const question = await Question
            .findOneAndDelete({ _id: id, askedBy: userData._id })
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
    } catch (error) {
        return res.status(500).json({ error })
    }
}

export {
    post,
    patch,
    getOne,
    getAll,
    deleteOne
}