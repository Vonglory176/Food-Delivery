import express from 'express'
import { addToCart, removeFromCart, syncCart } from '../controllers/cartController.js'
import { authMiddleware } from '../middleware/auth.js'

const cartRouter = express.Router()

cartRouter.patch('/add/:itemId', authMiddleware, addToCart)
cartRouter.patch('/remove/:itemId', authMiddleware, removeFromCart)
cartRouter.post('/sync', authMiddleware, syncCart)

export default cartRouter