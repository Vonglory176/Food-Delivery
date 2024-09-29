import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Place an order
const placeOrder = async (req, res, next) => {
    console.log("\n IN PLACE ORDER --------------------------- \n")

    const { userId, items, amount, address } = req.body

    const requiredFields = ["userId", "items", "amount", "address"]

    try {
        if (!requiredFields.every(field => field in req.body)) {
            throw { status: 400, clientMessage: 'Missing required fields' }
        }

        const newOrder = new orderModel({
            userId: userId,
            items: items,
            amount: amount,
            address: address
        })

        await newOrder.save()
        await userModel.findByIdAndUpdate(userId, { cartData:{} })

        const line_items = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Delivery Fee',
                },
                unit_amount: 2*100,
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: process.env.FRONTEND_URL + `/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: process.env.FRONTEND_URL + `/verify?success=false&orderId=${newOrder._id}`
        })

        res.status(200).json({
            success: true,
            sessionId: session.id,
            sessionUrl: session.url
        })
        
        console.log("Order placed successfully")

    } catch (error) {

        console.log("\n ERROR IN PLACE ORDER --------------------------- \n")
        console.log(error)

        error.action = "Placing order"
        next(error)
    }  
}

// Verify order
const verifyOrder = async (req, res, next) => {
    console.log("\n IN VERIFY ORDER --------------------------- \n")

    const { orderId, success } = req.body

    const requiredFields = ["orderId"]

    try {
        if (!requiredFields.every(field => field in req.body)) {
            throw { status: 400, clientMessage: 'Missing required fields' }
        }

        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            res.status(200).json({
                success: true,
                message: "Order verified successfully"
            })
        }
        else {
            await orderModel.findByIdAndUpdate(orderId, { payment: false })
            res.status(200).json({
                success: false,
                message: "Order failed"
            })
        }

        res.status(200).json({
            success: true,
            sessionId: session.id,
            sessionUrl: session.url
        })
        
        console.log("Order verified successfully")

    } catch (error) {

        console.log("\n ERROR IN VERIFY ORDER --------------------------- \n")
        console.log(error)

        error.action = "Verifying order"
        next(error)
    }
}

// User orders (Client Side)
const userOrders = async (req, res, next) => {
    console.log("\n IN USER ORDER LIST --------------------------- \n")

    const { userId } = req.body

    const requiredFields = ["userId"]

    try {
        if (!requiredFields.every(field => field in req.body)) {
            throw { status: 400, clientMessage: 'Missing required fields' }
        }

        const orders = await orderModel.find({ userId: userId })

        res.status(200).json({
            success: true,
            data: orders
        })
        
        console.log("User orders fetched successfully")

    } catch (error) {

        console.log("\n ERROR IN USER ORDER LIST --------------------------- \n")
        console.log(error)

        error.action = "Fetching user orders"
        next(error)
    }
}

// Admin orders (Admin Side)
const adminOrders = async (req, res, next) => {
    console.log("\n IN ADMIN ORDER LIST --------------------------- \n")

    // const requiredFields = ["userId"]

    try {
        // if (!requiredFields.every(field => field in req.body)) {
        //     throw { status: 400, clientMessage: 'Missing required fields' }
        // }

        const orders = await orderModel.find({})

        res.status(200).json({
            success: true,
            data: orders
        })
        
        console.log("Orders fetched successfully")

    } catch (error) {

        console.log("\n ERROR IN ADMIN ORDER LIST --------------------------- \n")
        console.log(error)

        error.action = "Fetching admin order list"
        next(error)
    }
}


// Admin update order status
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
    placeOrder,
    verifyOrder,
    userOrders,
    adminOrders,
    adminUpdateOrderStatus
}


