import userModel from "../models/userModel.js";

// Add Items to cart
const addToCart = async (req, res, next) => {
    console.log("\n IN ADD TO CART --------------------------- \n")

    const { userId, itemId } = req.body

    const requiredFields = ["userId", "itemId"]

    try {
        if (!requiredFields.every(field => field in req.body)) {
            throw { status: 400, clientMessage: 'Missing required fields' }
        }


        let userData = await userModel.findOne({ _id: userId })
        let cartData = await userData.cartData

        if (!cartData[itemId]) {
            cartData[itemId] = 1
        }
        else {
            cartData[itemId] += 1
        }

        await userModel.findByIdAndUpdate( userId, { cartData } )

        const successMessage = "Item added to cart successfully"
        res.status(200).json({
            success: true, 
            message: successMessage
        })
        
        console.log(successMessage)

    } catch (error) {

        console.log("\n ERROR IN ADD TO CART --------------------------- \n")
        console.log(error)

        error.action = "Adding item to cart"
        next(error)
    }    
}

// Remove Items from cart
const removeFromCart = async (req, res, next) => {
    console.log("\n IN REMOVE FROM CART --------------------------- \n")

    const { userId, itemId } = req.body

    const requiredFields = ["userId", "itemId"]

    try {
        if (!requiredFields.every(field => field in req.body)) {
            throw { status: 400, clientMessage: 'Missing required fields' }
        }


        let userData = await userModel.findOne({ _id: userId })
        let cartData = await userData.cartData

        if (cartData[itemId] && cartData[itemId] > 1) {
            cartData[itemId] -= 1
        } else {
            delete cartData[itemId]
        }

        await userModel.findByIdAndUpdate( userId, { cartData } )

        const successMessage = "Item removed from cart successfully"
        res.status(200).json({
            success: true, 
            message: successMessage
        })
        
        console.log(successMessage)

    } catch (error) {

        console.log("\n ERROR IN REMOVE FROM CART --------------------------- \n")
        console.log(error)

        error.action = "Removing item from cart"
        next(error)
    }  
}

// Get cart items
const getCart = async (req, res, next) => {
    console.log("\n IN GET CART --------------------------- \n")

    const { userId } = req.body

    const requiredFields = ["userId"]

    try {
        if (!requiredFields.every(field => field in req.body)) {
            throw { status: 400, clientMessage: 'Missing required fields' }
        }

        let userData = await userModel.findOne({ _id: userId })
        let cartData = await userData.cartData

        res.status(200).json({
            success: true, 
            cartData: cartData || []
        })
        
        console.log("Cart items fetched successfully")

    } catch (error) {

        console.log("\n ERROR IN GET CART --------------------------- \n")
        console.log(error)

        error.action = "Fetching cart items"
        next(error)
    }  
}

export { addToCart, removeFromCart, getCart }