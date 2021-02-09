const express = require("express")
const userController = require("../controllers/users")

const router = express.Router()

router.post("/signup", userController.signup)
router.post("/login", userController.login)

// +--------------------------------------------------------+
// |         Following routes are just for dev              |
// +--------------------------------------------------------+
router.get("/", userController.getAll)
router.delete("/", userController.delAll)


module.exports = router