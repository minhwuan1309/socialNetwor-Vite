const router = require("express").Router()
const ctrls = require("../controllers/auth")
const { verifyAccessToken, isAdmin } = require("../utils/verifyToken")
const uploadFile = require("../middlewares/multer")


router.post("/register", uploadFile, ctrls.register)
router.post("/login", ctrls.login)
router.get("/logout", ctrls.logout)



module.exports = router