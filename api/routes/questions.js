const express = require("express")
const upload = require("../middlewares/upload")
const checkAuth = require("../middlewares/check_auth")
const question_controller = require("../controllers/questions")

const router = express.Router()

router.get("/", question_controller.get_all)
router.post("/", checkAuth, upload, question_controller.post)
router.get("/:id", question_controller.get_one)
router.patch("/:id", checkAuth, question_controller.patch)
router.delete("/:id", checkAuth, question_controller.delete)

module.exports = router