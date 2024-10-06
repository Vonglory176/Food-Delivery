import express from "express"
import { adminCreateFood, adminRemoveFood } from "../controllers/admin/foodController.js"
import { getFood } from "../controllers/common/foodController.js"
import { authMiddleware } from "../middleware/auth.js"
import upload from '../config/multerConfig.js'

const foodRouter = express.Router()


// Admin routes
foodRouter.post("/add", authMiddleware, upload.single("image"), adminCreateFood)
foodRouter.delete("/remove/:itemId", authMiddleware, adminRemoveFood)


// Common routes
foodRouter.get("/list", getFood)



export default foodRouter