import express from 'express'
import authMiddleware from '../middleware/authMiddleware'
import { placeOrder, verifyOrder, userOrders, adminOrders, adminUpdateOrderStatus } from '../controllers/orderController'

const orderRouter = express.Router()

orderRouter.post('/place', authMiddleware, placeOrder)
orderRouter.post('/verify', authMiddleware, verifyOrder)
orderRouter.post('/user-list', authMiddleware, userOrders)
orderRouter.post('/admin-list', authMiddleware, adminOrders)
orderRouter.post('/admin-update-status', authMiddleware, adminUpdateOrderStatus)

export default orderRouter
