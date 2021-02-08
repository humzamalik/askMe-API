const express = require("express")

const routes = express.Router()

const questionRoutes = require("./questions")
const answerRoutes = require("./answers")
const userRoutes = require("./user")

routes.use("/questions", questionRoutes)
routes.use("/answers", answerRoutes)
routes.use("/users", userRoutes)

module.exports = routes