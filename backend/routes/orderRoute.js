import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { userPlaceOrder, userVerifyOrder, userGetOrders } from '../controllers/user/orderController.js'
import { adminGetOrders, adminUpdateOrderStatus } from '../controllers/admin/orderController.js'
import { generateAccessToken } from '../controllers/common/authController.js'

const orderRouter = express.Router()

// User routes
orderRouter.post('/place', authMiddleware, userPlaceOrder)
orderRouter.patch('/verify', authMiddleware, userVerifyOrder)
orderRouter.get('/user-list', authMiddleware, userGetOrders)

// Admin routes
orderRouter.post('/admin-list', authMiddleware, adminGetOrders)
orderRouter.post('/admin-update-status', authMiddleware, adminUpdateOrderStatus)

export default orderRouter
