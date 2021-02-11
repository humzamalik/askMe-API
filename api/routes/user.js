import express from "express"
import { signup, login, getAll, delAll } from "../controllers/users"

const router = express.Router()

router.route('/signup')
    .post(signup)

router.route('/login')
    .post(login)

// +--------------------------------------------------------+
// |         Following routes are just for dev              |
// +--------------------------------------------------------+
router.route("/")
    .get(getAll)
    .delete(delAll)


module.exports = router