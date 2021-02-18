import express from "express"
import upload from "../middlewares/upload"
import checkAuth from "../middlewares/check_auth"
import { getAll, post, getOne, patch, deleteOne } from "../controllers/questions"

const router = express.Router()

router.route("/")
    .get(getAll)
    .post(checkAuth, upload, post)

router.route("/:id")
    .get(getOne)
    .patch(checkAuth, patch)
    .delete(checkAuth, deleteOne)

export default router