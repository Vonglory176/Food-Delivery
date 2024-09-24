import foodModel from "../models/foodModel.js"
import fs from 'fs' // Prevents errors when deleting files (Prebuilt Node.js module)

// CREATE FOOD
const createFood = async (req, res, next) => {
    console.log("\n IN CREATE FOOD --------------------------- \n")

    const requiredFields = ["name", "description", "price", "category"] // Not including image    

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
        res.status(200).json({
            success: true, 
            message: "Food created successfully" // , newFood
        })

    } catch (error) {

        console.log("\n ERROR IN CREATE FOOD --------------------------- \n")
        console.log(error)

        error.action = "Creating food"
        next(error)

        // res.status(500).json({
        //     success: false,
        //     message: "Error creating food" // error
        // })
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

    try {

        const foods = await foodModel.findById(req.body.id)
        fs.unlink(`uploads/${foods.image}`, (err) => {
            if (err) {
                console.error(err)
                return
            }
            console.log(`${foods.image} was deleted`)
        })

        await foodModel.findByIdAndDelete(req.body.id)

        res.status(200).json({
            success: true,
            message: "Food removed successfully"
        })

    } catch (error) {

        console.log("\n ERROR IN REMOVE FOOD --------------------------- \n")
        console.log(error)
        
        error.action = "Removing food"
        next(error)
    }
}


export { createFood, getFood, removeFood }