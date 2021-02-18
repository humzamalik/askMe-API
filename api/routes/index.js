import express from "express"
import userRoutes from "./user"
import answerRoutes from "./answers"
import questionRoutes from "./questions"

const routes = express.Router()

routes.use("/users", userRoutes)
routes.use("/answers", answerRoutes)
routes.use("/questions", questionRoutes)

export default routes