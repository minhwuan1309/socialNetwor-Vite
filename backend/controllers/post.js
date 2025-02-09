const asyncHandler = require("express-async-handler")
const Post = require("../models/post")
const getDataUrl = require("../utils/urlGenerate")
const User = require("../models/user")
const cloudinary = require("cloudinary").v2

const newPost = asyncHandler(async (req, res) => {
    const { caption } = req.body
    const ownerId = req.user._id
 
    const file = req.file
    if (!file) {
        res.status(400)
        throw new Error("File is required!")
    }

    let option

    const type = req.query.type
    if (type === "reel") {
        option = {
            resource_type: "video",
        }
    }else{
        option = {}
    }

    const myCloud = await cloudinary.uploader.upload(req.file.path, option)

    const post = await Post.create({
        caption,
        post: {
            id: myCloud.public_id,
            url: myCloud.secure_url,
        },
        owner: ownerId,
        type,
    })
    res.status(200).json({
        message: "Post created successfully!",
        post
    })
})

const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({
            message: "Post not found!"
        })
    }
    if(post.owner.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message: "Unauthorized!"   
        })
    }

    await cloudinary.uploader.destroy(post.post.id)
    await post.deleteOne()
    res.status(200).json({
        message: "Post deleted successfully!"
    })
})

const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({type: "post"}).sort({createdAt: -1}).populate("owner", "-password")

    const reels = await Post.find({type: "reel"}).sort({createdAt: -1}).populate("owner", "-password")
    res.status(200).json({
        posts,
        reels
    })
})

const likeAndUnlike = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({
            message: "Post not found!"
        })
    }

    if(post.likes.includes(req.user._id)){
        const index = post.likes.indexOf(req.user._id)
        post.likes.splice(index, 1)
        await post.save()
        res.json({
            message: "Post Unliked!"
        })
    }else{
        post.likes.push(req.user._id)
        await post.save()
        res.json({
            message: "Post Liked!"
        })
    }
})

const commentOnPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({
            message: "Post not found!"
        })
    }
    post.comments.comment = req.body.comment
    post.comments.push({
        user: req.user._id,
        name: req.user.name,
        comment: req.body.comment
    })
    await post.save()
    res.status(200).json({
        message: "Comment added successfully!"
    })
})

const deleteComment = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({
            message: "Post not found!"
        })
    }
    if(!req.body.commentId){
        return res.status(400).json({
            message: "Comment id is required!"
        })
    }
    
    const commentIndex = post.comments.findIndex(
        (item) => item._id.toString() === req.body.commentId.toString()
    )
    if(commentIndex === -1){
        return res.status(400).json({
            message: "Comment not found!"
        })
    }

    const comment = post.comments[commentIndex]
    if(post.owner.toString() === req.user._id.toString() || comment.user.toString() === req.user._id.toString()){
        post.comments.splice(commentIndex, 1)
        await post.save()
        res.status(200).json({
            message: "Comment deleted successfully!"
        })
    }else{
        return res.status(400).json({
            message: "Unauthorized!"
        })
    }
})

const editCaption = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if(!post){
        return res.status(404).json({
            message: "Post not found!"
        })
    }
    if(post.owner.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message: "Unauthorized!"
        })
    }
    post.caption = req.body.caption
    await post.save()
    res.status(200).json({
        message: "Caption updated successfully!"
    })
})

module.exports = {
    newPost,
    deletePost,
    getAllPosts,
    likeAndUnlike,
    commentOnPost,
    deleteComment,
    editCaption
}