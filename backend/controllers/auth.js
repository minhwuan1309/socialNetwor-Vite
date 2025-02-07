const asyncHandler = require("express-async-handler")
const User = require("../models/user")
const getDataUrl = require("../utils/urlGenerate")
const generateToken= require("../utils/generateToken")
const cloudinary = require("cloudinary").v2
const bcryptjs = require("bcryptjs")


const register = asyncHandler(async (req, res) => {
    try {
        const { name, email, password, gender } = req.body
        const file = req.file

        if (!name || !email || !password || !gender || !file) {
            return res.status(400).json({ message: "Missing inputs!" })
        }

        // Kiểm tra email đã tồn tại chưa
        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "User already exists!" })

        // Hash mật khẩu
        const hashedPassword = await bcryptjs.hash(password, 10)

        // Upload ảnh lên Cloudinary
        const myCloud = await cloudinary.uploader.upload(req.file.path, {
            folder: "SocialNetwork",
            resource_type: "image",
            transformation: [{ width: 500, height: 500, crop: "limit" }]
        })

        // Tạo người dùng mới
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

        // Tạo token đăng nhập
        generateToken(user._id, res)

        res.status(201).json({ message: "Register successfully!", user })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Missing inputs!" })
        }

        // Kiểm tra email và mật khẩu trong database
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "User not found!" })

        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: "Incorrect Email Or Password!" })
        
        // Tạo token đăng nhập
        generateToken(user._id, res)

        res.status(200).json({ message: "Login successfully!", user })
    
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


const logout = asyncHandler(async (req, res) => {
    try {
        res.cookie("token", "", {
            maxAge: 0
        })
        res.status(200).json({message: "Logged out successfully!"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

module.exports = {
    register,
    login,
    logout
}