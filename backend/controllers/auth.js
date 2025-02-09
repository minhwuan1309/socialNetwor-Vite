const asyncHandler = require("express-async-handler")
const User = require("../models/user")
const generateToken = require("../utils/generateToken")
const cloudinary = require("cloudinary").v2
const bcryptjs = require("bcryptjs")

const register = asyncHandler(async (req, res) => {
    const { name, email, password, gender } = req.body
    const file = req.file

    if (!name || !email || !password || !gender || !file) {
        res.status(400)
        throw new Error("Missing inputs!")
    }

    let user = await User.findOne({ email })
    if (user) {
        res.status(400)
        throw new Error("User already exists!")
    }

    const hashedPassword = await bcryptjs.hash(password, 10)

    const myCloud = await cloudinary.uploader.upload(req.file.path, {
        folder: "SocialNetwork",
        resource_type: "image",
        transformation: [{ width: 500, height: 500, crop: "limit" }]
    })

    user = await User.create({
        name,
        email,
        password: hashedPassword,
        avatar: {
            id: myCloud.public_id,
            url: myCloud.secure_url
        },
        gender
    })

    generateToken(user._id, res)

    res.status(201).json({ message: "Register successfully!", user })
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error("Missing inputs!")
    }

    const user = await User.findOne({ email })
    if (!user) {
        res.status(400)
        throw new Error("User not found!")
    }

    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
        res.status(400)
        throw new Error("Incorrect Email Or Password!")
    }

    generateToken(user._id, res)

    res.status(200).json({ message: "Login successfully!", user })
})

const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "", { maxAge: 0 })
    res.status(200).json({ message: "Logged out successfully!" })
})

module.exports = {
    register,
    login,
    logout
}
