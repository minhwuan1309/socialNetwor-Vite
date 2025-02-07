const isAuth = require("../middlewares/isAuth")
const ctrls = require("../controllers/user")

const router = require("express").Router()

router.get('/current', isAuth, ctrls.myProfile)
router.get('/:id', ctrls.userProfile)

module.exports = router