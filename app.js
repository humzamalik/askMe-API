const express = require("express")
const app = express()

const questionRoutes = require("./api/routes/questions")
const answerRoutes = require("./api/routes/answers")

app.use("/questions", questionRoutes)
app.use("/answers", answerRoutes)

module.exports = app
