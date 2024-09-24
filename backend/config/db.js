import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

export const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to MongoDB")
    })
}
// mongodb+srv://Vonglory176:LrapX4tXO5gnTnwg@cluster0.kl50m.mongodb.net/MERN-Food-Delivery-Project-Database
// mongodb+srv://Vonglory176:LrapX4tXO5gnTnwg@cluster0.kl50m.mongodb.net/?
// retryWrites=true&w=majority&appName=Cluster0
