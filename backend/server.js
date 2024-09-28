import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"

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
app.use(express.json())
app.use(cors())



// DB Config
connectDB()



// API Endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static("uploads")) // path.join(__dirname, "uploads")
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