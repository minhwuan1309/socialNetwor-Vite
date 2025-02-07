const { default: mongoose } = require('mongoose')
mongoose.set('strictQuery', false)

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connection is successful!")
    } catch (error) {
        console.log("Failed to connect to DB")
        throw new Error(error)
    }
}

module.exports = dbConnect 