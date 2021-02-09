const express = require("express")
const checkAuth = require("../middlewares/check_auth")
const answerController = require("../controllers/answers")

const router = express.Router()

router.get("/", answerController.getAll)
router.get("/:id", answerController.getOne)
router.post("/", checkAuth, answerController.post)
router.patch("/:id", checkAuth, answerController.patch)
router.delete("/:id", checkAuth, answerController.delete)

module.exports = router