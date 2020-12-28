const express = require("express")
const app = express()

const questionRoutes = require("./api/routes/questions")
const answerRoutes = require("./api/routes/answers")

app.use("/questions", questionRoutes)
app.use("/answers", answerRoutes)

app.use((req, res, next) => {
    const err = new Error("Not Found")
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        code: err.status
    })
})

module.exports = app
