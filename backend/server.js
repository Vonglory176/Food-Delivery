import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { connectDB } from "./config/dbConfig.js"
import cookieParser from "cookie-parser"

import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware.js"



// App Config
const app = express()
const port = 4000
// const url = "http://localhost:4000"



// Middlewares
app.use(express.json({ limit: '50mb' }))
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Ensure all methods needed are allowed
    allowedHeaders: ['Content-Type', 'Authorization'], // Ensure headers your frontend sends are allowed
    exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'], // Expose headers
    credentials: true // Allows cookies
}))
app.use(cookieParser(process.env.COOKIE_SECRET))



// DB Config
connectDB()



// API Endpoints
app.use("/images", express.static("uploads")) // path.join(__dirname, "uploads")
app.use("/api/food", foodRouter)
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)


// Error Handling (These fire when a request error occurs (above) in Routes)
app.use(notFoundHandler)
app.use(errorHandler)



app.get("/", (req, res) => {
    res.send("API is running...")
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})

// mongodb+srv://Vonglory176:LrapX4tXO5gnTnwg@cluster0.kl50m.mongodb.net/?
// retryWrites=true&w=majority&appName=Cluster0