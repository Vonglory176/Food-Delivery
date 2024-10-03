import foodModel from "../models/foodModel.js"
import fs from 'fs' // Prevents errors when deleting files (Prebuilt Node.js module)

// CREATE FOOD
const createFood = async (req, res, next) => {
    console.log("\n IN CREATE FOOD --------------------------- \n")

    const requiredFields = ["name", "description", "price", "category"] // Not including image    
    console.log(req.body)

    try {
        if (!req.file || !requiredFields.every(field => field in req.body)) {
            throw { status: 400, clientMessage: 'Missing required fields' }
        }


        let image_filename = `${req.file.filename}`
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename
        })

        const newFood = await food.save()

        const successMessage = "Food created successfully"
        res.status(200).json({
            success: true, 
            message: successMessage, // , newFood
        })
        
        console.log(successMessage)

    } catch (error) {

        console.log("\n ERROR IN CREATE FOOD --------------------------- \n")
        console.log(error)

        error.action = "Creating food"
        next(error)
    }
}


// GET FOOD
const getFood = async (req, res, next) => {
    console.log("\n IN GET FOOD --------------------------- \n")

    try {

        const foods = await foodModel.find()
        res.status(200).json({
            success: true,
            foodList: foods
        })

        console.log("Foods fetched successfully")

    } catch (error) {

        console.log("\n ERROR IN GET FOOD --------------------------- \n")
        console.log(error)
        
        error.action = "Getting food"
        next(error)
    }
}


// REMOVE FOOD
const removeFood = async (req, res, next) => {
    console.log("\n IN REMOVE FOOD --------------------------- \n")
    console.log(req.body, req.params, req.query)

    
    try {
        // Get ID & Food
        const { itemId } = req.params
        if (!itemId) throw { status: 400, clientMessage: 'Missing required fields' }

        const foods = await foodModel.findById(itemId)
        

        // Remove Image
        fs.unlink(`uploads/${foods?.image}`, (err) => {
            if (err) {
                console.error(err)
                return
            }
            else console.log(`Image was deleted`)
        })

        // Remove Food
        await foodModel.findByIdAndDelete(itemId)


        // Send Resposne
        const successMessage = "Food removed successfully"
        res.status(200).json({
            success: true,
            message: successMessage
        })
        console.log(successMessage)

    } catch (error) {

        console.log("\n ERROR IN REMOVE FOOD --------------------------- \n")
        console.log(error)
        
        error.action = "Removing food"
        next(error)
    }
}


export { createFood, getFood, removeFood }