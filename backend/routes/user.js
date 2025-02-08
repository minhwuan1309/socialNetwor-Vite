const isAuth = require("../middlewares/isAuth")
const ctrls = require("../controllers/user")
const uploadFile = require("../middlewares/multer")

const router = require("express").Router()

//GET
router.get('/current', isAuth, ctrls.myProfile)
router.get('/:id', isAuth, ctrls.userProfile)
router.get('/followdata/:id', isAuth, ctrls.userFollowerAndFollowingData)

//PUT
router.put('/:id', isAuth, uploadFile, ctrls.updateProfile)
router.put('/password/:id', isAuth, ctrls.updatePassword)

//POST
router.post('/follow/:id', isAuth, ctrls.followAndUnfollow)

module.exports = router