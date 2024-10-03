import foodModel from "../../models/foodModel.js"

// GET FOOD (Common)
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

export { getFood }