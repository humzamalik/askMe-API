const express = require("express")

const routes = express.Router()

const userRoutes = require("./user")
const answerRoutes = require("./answers")
const questionRoutes = require("./questions")

routes.use("/users", userRoutes)
routes.use("/answers", answerRoutes)
routes.use("/questions", questionRoutes)

module.exports = routes