import orderModel from "../../models/orderModel.js"

// Get orders
const getOrders = async (req, res, next) => {
    console.log("\n IN GET ORDER LIST --------------------------- \n")

    const { userId, isAdmin } = req.body

    try {
        const orders = await orderModel.find({  }) // userId: userId

        res.status(200).json({
            success: true,
            data: orders
        })
        
        console.log("Orders fetched successfully")

    } catch (error) {

        console.log("\n ERROR IN GET ORDER LIST --------------------------- \n")
        console.log(error)

        error.action = "Fetching orders"
        next(error)
    }
}

export {
    getOrders
}