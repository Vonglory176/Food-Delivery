import userModel from "../../models/userModel.js"

// SYNC CART (First time login or manual sync) (User)
const userSyncCart = async (req, res, next) => {
    console.log("\n IN SYNC CART --------------------------- \n")
    console.log(req.body, req.params, req.query)

    const { userId, cartData: localCartData= {} } = req.body
    console.log(localCartData)

    try {
        if (!localCartData) throw { status: 400, clientMessage: 'Missing required fields' }

        // Fetch server cart data
        const serverCartData = await userModel.findById(userId).select('cartData')

        // Merge logic with local quantities prioritized
        const mergedCartData = mergeCarts(localCartData, serverCartData.cartData)

        // Update the user's cart with the merged data
        await userModel.findByIdAndUpdate(userId, { cartData: mergedCartData })

        const successMessage = "Cart synchronized successfully"
        res.status(200).json({
            success: true, 
            // message: successMessage,
            cartData: mergedCartData
        })
        
        console.log(successMessage)

    } catch (error) {
        console.log("\n ERROR IN SYNC CART --------------------------- \n")
        console.log(error)

        error.action = "Syncing cart data"
        next(error)
    }
}

// Function to merge local and server cart data (Prioritizes Server Quantities)
const mergeCarts = (localCart, serverCart) => {
    const mergedCart = { ...localCart }

    for (const itemId in serverCart) {
        // Prioritize local quantities over server quantities
        mergedCart[itemId] = serverCart[itemId]
    }

    return mergedCart
}

// ADD TO CART (User)
const userAddToCart = async (req, res, next) => {
    console.log("\n IN ADD TO CART --------------------------- \n")
    console.log(req.body, req.params, req.query)

    try {
        const { userId } = req.body
        const { itemId } = req.params
        if (!itemId) throw { status: 400, clientMessage: 'Missing required fields' }

        let userData = await userModel.findOne({ _id: userId })
        let cartData = userData.cartData || {}

        // Add item to cart
        cartData[itemId] = (cartData[itemId] || 0) + 1

        await userModel.findByIdAndUpdate(userId, { cartData })

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


// REMOVE FROM CART (User)
const userRemoveFromCart = async (req, res, next) => {
    console.log("\n IN REMOVE FROM CART --------------------------- \n")

    const { userId } = req.body
    const { itemId } = req.params

    try {
        if (!itemId) throw { status: 400, clientMessage: 'Missing required fields' }

        let userData = await userModel.findOne({ _id: userId })
        let cartData = userData.cartData || {}

        if (cartData[itemId]) {
            if (cartData[itemId] > 1) {
                cartData[itemId] -= 1 // Decrease quantity
            } else {
                delete cartData[itemId] // Remove item if quantity is 1
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData })

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


export { userSyncCart, userAddToCart, userRemoveFromCart }


// Get cart items
// const getCart = async (req, res, next) => {
//     console.log("\n IN GET CART --------------------------- \n")

//     const { userId } = req.body

//     const requiredFields = ["userId"]

//     try {
//         if (!requiredFields.every(field => field in req.body)) {
//             throw { status: 400, clientMessage: 'Missing required fields' }
//         }

//         let userData = await userModel.findOne({ _id: userId })
//         let cartData = await userData.cartData

//         res.status(200).json({
//             success: true, 
//             cartData: cartData || []
//         })
        
//         console.log("Cart items fetched successfully")

//     } catch (error) {

//         console.log("\n ERROR IN GET CART --------------------------- \n")
//         console.log(error)

//         error.action = "Fetching cart items"
//         next(error)
//     }
// }

// Add items to cart
// const addToCart = async (req, res, next) => {
//     console.log("\n IN ADD TO CART --------------------------- \n")
//     console.log(req.body, req.params, req.query)

    
//     try {
//         // const userId = convertToObjectId(req.body.userId)
//         const { userId } = req.body
//         const { id: itemId } = req.params
//         if (!itemId) throw { status: 400, clientMessage: 'Missing required fields' }


//         let userData = await userModel.findOne({ _id: userId })
//         let cartData = await userData.cartData

//         return

//         if (!cartData[itemId]) {
//             cartData[itemId] = 1
//         }
//         else {
//             cartData[itemId] += 1
//         }

//         await userModel.findByIdAndUpdate( userId, { cartData } )

//         const successMessage = "Item added to cart successfully"
//         res.status(200).json({
//             success: true, 
//             message: successMessage
//         })
        
//         console.log(successMessage)

//     } catch (error) {

//         console.log("\n ERROR IN ADD TO CART --------------------------- \n")
//         console.log(error)

//         error.action = "Adding item to cart"
//         next(error)
//     }    
// }

// Remove Items from cart
// const removeFromCart = async (req, res, next) => {
//     console.log("\n IN REMOVE FROM CART --------------------------- \n")

//     const { userId, itemId } = req.body

//     const requiredFields = ["userId", "itemId"]

//     try {
//         if (!requiredFields.every(field => field in req.body)) {
//             throw { status: 400, clientMessage: 'Missing required fields' }
//         }


//         let userData = await userModel.findOne({ _id: userId })
//         let cartData = await userData.cartData

//         if (cartData[itemId] && cartData[itemId] > 1) {
//             cartData[itemId] -= 1
//         } else {
//             delete cartData[itemId]
//         }

//         await userModel.findByIdAndUpdate( userId, { cartData } )

//         const successMessage = "Item removed from cart successfully"
//         res.status(200).json({
//             success: true, 
//             message: successMessage
//         })
        
//         console.log(successMessage)

//     } catch (error) {

//         console.log("\n ERROR IN REMOVE FROM CART --------------------------- \n")
//         console.log(error)

//         error.action = "Removing item from cart"
//         next(error)
//     }  
// }


// Add/Remove cart items
// const updateCart = async (req, res, next) => {
//     console.log("\n IN UPDATE CART --------------------------- \n")
//     console.log(req.body, req.params, req.query)

    
//     try {
//         const { userId, cartData: newCartData } = req.body

//         // Check new Cart Data
//         if (!newCartData) throw { status: 400, clientMessage: 'Missing required fields' }
//         if (!Array.isArray(newCartData)) throw { status: 400, clientMessage: 'Invalid cart data format' }


//         // Update Cart
//         await userModel.findByIdAndUpdate( userId, { cartData: newCartData } )    
//         // let userData = await userModel.findOne({ _id: userId })


//         const successMessage = "Item added to cart successfully"
//         res.status(200).json({
//             success: true, 
//             message: successMessage
//         })
        
//         console.log(successMessage)

//     } catch (error) {

//         console.log("\n ERROR IN ADD TO CART --------------------------- \n")
//         console.log(error)

//         error.action = "Adding item to cart"
//         next(error)
//     }    
// }