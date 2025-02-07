const jwt = require("jsonwebtoken")
const User = require("../models/user")
const asyncHandler = require("express-async-handler")

const isAuth = asyncHandler(async (req, res, next) => {
    try{
        const token = req.cookies.token
        if(!token) return res.status(403).json({mes: "Unauthorized"})
        
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        if(!decodedData)
            return res.status(400).json({
                message: "Token Expired"
            })
        req.user = await User.findById(decodedData.id)
        next()
    }catch(err){
        res.status(500).json({message: "Please Login"})
    }
})

module.exports = isAuth