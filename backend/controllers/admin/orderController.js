// UPDATE ORDER STATUS (Admin)
const adminUpdateOrderStatus = async (req, res, next) => {
    console.log("\n IN ADMIN UPDATE ORDER STATUS --------------------------- \n")

    const { orderId, status } = req.body
    
    try {
        // if (!requiredFields.every(field => field in req.body)) {
        //     throw { status: 400, clientMessage: 'Missing required fields' }
        // }

        const response = await orderModel.findByIdAndUpdate(orderId, { status: status })

        const successMessage = "Order status updated successfully"
        res.status(200).json({
            success: true,
            message: successMessage
        })
        
        console.log("Order status updated successfully")

    } catch (error) {

        console.log("\n ERROR IN ADMIN UPDATE ORDER STATUS --------------------------- \n")
        console.log(error)

        error.action = "Fetching admin order list"
        next(error)
    }
}

export {
    adminUpdateOrderStatus
}

// // GET ORDERS (Admin)
// const adminGetOrders = async (req, res, next) => {
//     console.log("\n IN ADMIN ORDER LIST --------------------------- \n")

//     // const requiredFields = ["userId"]

//     try {
//         // if (!requiredFields.every(field => field in req.body)) {
//         //     throw { status: 400, clientMessage: 'Missing required fields' }
//         // }

//         const orders = await orderModel.find({})

//         res.status(200).json({
//             success: true,
//             data: orders
//         })
        
//         console.log("Orders fetched successfully")

//     } catch (error) {

//         console.log("\n ERROR IN ADMIN ORDER LIST --------------------------- \n")
//         console.log(error)

//         error.action = "Fetching admin order list"
//         next(error)
//     }
// }