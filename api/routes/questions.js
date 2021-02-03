const express = require("express")
const upload = require("../middlewares/upload")
const question_controller = require("../controllers/questions")

const router = express.Router()

router.get("/", question_controller.get_all)
router.post("/", upload, question_controller.post)
router.get("/:id", question_controller.get_one)
router.patch("/:id", question_controller.patch)
router.delete("/:id", question_controller.delete)

module.exports = router