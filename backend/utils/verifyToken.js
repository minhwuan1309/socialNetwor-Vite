const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    if(req?.headers?.authorization?.startsWith("Bearer ")){
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
            if(err){
                res.status(401).json({
                    success: false,
                    mes: 'Invalid access token'
                })
            }
            req.user = decode
            next()
        })
    }else{
        res.status(401).json({
            success: false,
            mes: 'Require authentication'
        })
    }
})

const isAdmin = asyncHandler(async (req, res, next) => {
    const {role} = req.user
    if(+role !== "ADMIN"){
        return res.status(401).json({
            success: false,
            mes: 'Require admin role'
        })
    }
})

module.exports = {
    verifyAccessToken,
    isAdmin
}