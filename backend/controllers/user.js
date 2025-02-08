const User = require("../models/user")
const asyncHandler = require("express-async-handler")
const getDataUrl = require("../utils/urlGenerate")
const cloudinary = require("cloudinary").v2
const bcryptjs = require("bcryptjs")

const myProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password")
  res.status(200).json(user)
})

const userProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      res.status(404).json({ message: "User not found!" })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

const followAndUnfollow = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const loggedInUser = await User.findById(req.user._id)
  
    if(!user)
      return res.status(404).json({ message: "User not found!" })
  
    if(user._id.toString() === loggedInUser._id.toString())
      return res.status(400).json({ message: "You can't follow yourself!" })
  
    if(user.followers.includes(loggedInUser._id)){
      const indexFollowing = loggedInUser.followings.indexOf(user._id)
      const indexFollower = user.followers.indexOf(loggedInUser._id)

      loggedInUser.followings.splice(indexFollowing, 1)
      user.followers.splice(indexFollower, 1)

      await loggedInUser.save()
      await user.save()

      res.status(200).json({ message: "User Unfollowed!" })
    }else{
      loggedInUser.followings.push(user._id)
      user.followers.push(loggedInUser._id)

      await loggedInUser.save()
      await user.save()

      res.status(200).json({ message: "User Followed!" })
    }
  } catch (error) {
    
  }
})

const userFollowerAndFollowingData = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").populate("followers", "-password").populate("followings", "-password")

    const followers = user.followers
    const followings = user.followings

    res.json({
      followers,
      followings
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const {name, email, password, gender} = req.body

    if(name) user.name = name

    if (req.file) {
      const fileUrl = getDataUrl(file)
      await cloudinary.uploader.destroy(user.avatar.id)

      const myCloud = await cloudinary.uploader.upload(fileUrl.content, {
        folder: "SocialNetwork",
        resource_type: "image",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      })
      
      user.avatar.id = myCloud.public_id
      user.avatar.url = myCloud.secure_url
    }

    await user.save()

    res.status(200).json({ message: "Profile Updated!" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const {oldPassword, newPassword} = req.body

    const isMatch = await bcryptjs.compare(oldPassword, user.password)
    if(!isMatch)
      return res.status(400).json({ message: "Previous Password is incorrect!" })

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(newPassword, salt)

    user.password = hashedPassword
    await user.save()

    res.status(200).json({ message: "Password Updated!" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = {
  myProfile,
  userProfile,
  followAndUnfollow,
  userFollowerAndFollowingData,
  updateProfile,
  updatePassword
}
