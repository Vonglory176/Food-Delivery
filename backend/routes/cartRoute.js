import express from 'express'
import { userAddToCart, userRemoveFromCart, userSyncCart } from '../controllers/user/cartController.js'
import { authMiddleware } from '../middleware/auth.js'

const cartRouter = express.Router()

// User routes
cartRouter.patch('/add/:itemId', authMiddleware, userAddToCart)
cartRouter.patch('/remove/:itemId', authMiddleware, userRemoveFromCart)
cartRouter.post('/sync', authMiddleware, userSyncCart)

export default cartRouter