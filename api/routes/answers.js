const express = require("express")
const answer_controller = require("../controllers/answers")

const router = express.Router()

router.get("/", answer_controller.get_all)
router.post("/", answer_controller.post)
router.get("/:id", answer_controller.get_one)
router.patch("/:id", answer_controller.patch)
router.delete("/:id", answer_controller.delete)

module.exports = router