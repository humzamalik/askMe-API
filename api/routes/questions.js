const express = require("express")
const upload = require("../middlewares/upload")
const checkAuth = require("../middlewares/check_auth")
const questionController = require("../controllers/questions")

const router = express.Router()

router.get("/", questionController.getAll)
router.get("/:id", questionController.getOne)
router.post("/", checkAuth, upload, questionController.post)
router.patch("/:id", checkAuth, questionController.patch)
router.delete("/:id", checkAuth, questionController.delete)

module.exports = router