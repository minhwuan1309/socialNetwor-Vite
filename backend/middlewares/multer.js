const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("cloudinary").v2

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "SocialNetwork",
        allowedFormats: ["jpg", "png", "jpeg"],
        transformation: [{width: 500, height: 500, crop: "limit"}]
    }
})

const uploadFile = multer({storage}).single("file")

module.exports = uploadFile