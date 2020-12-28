const express = require("express")
const router = express.Router()

router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "It will return all questions"
    })
})

router.post("/", (req, res, next) => {
    res.status(200).json({
        message: "It will use to post a question"
    })
})

router.get("/:id", (req, res, next) => {
    res.status(200).json({
        message: "It will return a question",
        id: req.params.id
    })
})

router.patch("/:id", (req, res, next) => {
    res.status(200).json({
        message: "It will use to update a question",
        id: req.params.id
    })
})

router.delete("/:id", (req, res, next) => {
    res.status(200).json({
        message: "It will delete a question",
        id: req.params.id
    })
})

module.exports = router