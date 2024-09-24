import express from "express"
import { createFood, getFood, removeFood } from "../controllers/foodController.js"
import multer from "multer"

const foodRouter = express.Router()

// Image Upload
const storage = multer.diskStorage({
    destination: "uploads",
    filename:(req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({ storage: storage })


// Food Routes (Starts with --> /api/food)
foodRouter.post("/create", upload.single("image"), createFood)
foodRouter.get("/get", getFood)
foodRouter.delete("/remove", removeFood)



export default foodRouter