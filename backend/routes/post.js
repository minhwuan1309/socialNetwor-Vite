const router = require("express").Router()
const ctrls = require("../controllers/post")
const isAuth = require("../middlewares/isAuth")
const uploadFile = require("../middlewares/multer")

//GET
router.get("/", isAuth, ctrls.getAllPosts)

//POST
router.post("/newpost", isAuth, uploadFile, ctrls.newPost)
router.post("/like/:id", isAuth, ctrls.likeAndUnlike)
router.post("/comment/:id", isAuth, ctrls.commentOnPost)
//PUT
router.put("/:id", isAuth, ctrls.editCaption)

//DELETE
router.delete("/:id", isAuth, ctrls.deletePost)
router.delete("/comment/:id", isAuth, ctrls.deleteComment)

module.exports = router