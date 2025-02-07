const express = require("express")
const dotenv = require("dotenv")
const dbConnect = require("./database/db.js")
const initRoutes = require("./routes")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const cloudinary = require("cloudinary").v2

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
})

const app = express()

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
dbConnect()
initRoutes(app)

const port = process.env.PORT || 8080

app.listen(port, ()=>{
    console.log(`Server is running on port http://localhost:${port}`)
})