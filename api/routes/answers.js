import express from "express"
import checkAuth from "../middlewares/check_auth"
import { getAll, post, getOne, patch, deleteOne } from "../controllers/answers"

const router = express.Router()

router.route("/")
    .get(getAll)
    .post(checkAuth, post)

router.route("/:id")
    .get(getOne)
    .patch(checkAuth, patch)
    .delete(checkAuth, deleteOne)


export default router