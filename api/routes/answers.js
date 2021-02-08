const express = require("express")
const checkAuth = require("../middlewares/check_auth")
const answer_controller = require("../controllers/answers")

const router = express.Router()

router.get("/", answer_controller.get_all)
router.post("/", checkAuth, answer_controller.post)
router.get("/:id", answer_controller.get_one)
router.patch("/:id", checkAuth, answer_controller.patch)
router.delete("/:id", checkAuth, answer_controller.delete)

module.exports = router