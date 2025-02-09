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
  const user = await User.findById(req.params.id).select("-password")

  if (!user) {
    res.status(404)
    throw new Error("User not found!")
  }

  res.status(200).json(user)
})

const followAndUnfollow = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  const loggedInUser = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error("User not found!")
  }

  if (user._id.toString() === loggedInUser._id.toString()) {
    res.status(400)
    throw new Error("You can't follow yourself!")
  }

  if (user.followers.includes(loggedInUser._id)) {
    const indexFollowing = loggedInUser.followings.indexOf(user._id)
    const indexFollower = user.followers.indexOf(loggedInUser._id)

    loggedInUser.followings.splice(indexFollowing, 1)
    user.followers.splice(indexFollower, 1)
  } else {
    loggedInUser.followings.push(user._id)
    user.followers.push(loggedInUser._id)
  }

  await loggedInUser.save()
  await user.save()

  res.status(200).json({
    message: user.followers.includes(loggedInUser._id) ? "User Followed!" : "User Unfollowed!"
  })
})

const userFollowerAndFollowingData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers", "-password")
    .populate("followings", "-password")

  if (!user) {
    res.status(404)
    throw new Error("User not found!")
  }

  res.json({
    followers: user.followers,
    followings: user.followings
  })
})

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  const { name, email, password, gender } = req.body

  if (name) user.name = name

  if (req.file) {
    const fileUrl = getDataUrl(req.file)
    await cloudinary.uploader.destroy(user.avatar.id)

    const myCloud = await cloudinary.uploader.upload(fileUrl.content, {
      folder: "SocialNetwork",
      resource_type: "image",
      transformation: [{ width: 500, height: 500, crop: "limit" }]
    })

    user.avatar.id = myCloud.public_id
    user.avatar.url = myCloud.secure_url
  }

  await user.save()

  res.status(200).json({ message: "Profile Updated!" })
})

const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    res.status(400)
    throw new Error("Both old and new passwords are required!")
  }

  const isMatch = await bcryptjs.compare(oldPassword, user.password)
  if (!isMatch) {
    res.status(400)
    throw new Error("Previous Password is incorrect!")
  }

  user.password = await bcryptjs.hash(newPassword, 10)
  await user.save()

  res.status(200).json({ message: "Password Updated!" })
})

module.exports = {
  myProfile,
  userProfile,
  followAndUnfollow,
  userFollowerAndFollowingData,
  updateProfile,
  updatePassword
}
