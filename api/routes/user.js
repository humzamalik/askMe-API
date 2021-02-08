const express = require("express")
const user_controller = require("../controllers/users")

const router = express.Router()

router.post("/signup", user_controller.signup)
router.post("/login", user_controller.login)

// +--------------------------------------------------------+
// |         Following routes are just for dev              |
// +--------------------------------------------------------+
router.get("/", user_controller.get_all_user)
router.delete("/", user_controller.del_all_user)


module.exports = router