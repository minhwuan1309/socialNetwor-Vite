const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    followings:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    avatar: {
        id: { type: String },   // ID của ảnh trên Cloudinary
        url: { type: String }   // Đường dẫn ảnh
    }    
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)