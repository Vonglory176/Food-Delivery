import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { userPlaceOrder, userVerifyOrder } from '../controllers/user/orderController.js'
import { adminUpdateOrderStatus } from '../controllers/admin/orderController.js'
import { getOrders } from '../controllers/common/orderController.js'

const orderRouter = express.Router()

// User routes
orderRouter.post('/place', authMiddleware, userPlaceOrder)
orderRouter.patch('/verify', authMiddleware, userVerifyOrder)

// Admin routes
orderRouter.post('/admin-update-status', authMiddleware, adminUpdateOrderStatus)

// Common routes
orderRouter.get('/list', authMiddleware, getOrders)

export default orderRouter
