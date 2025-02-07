const User = require("../models/user")
const asyncHandler = require("express-async-handler")

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

module.exports = {
  myProfile,
  userProfile,
}
