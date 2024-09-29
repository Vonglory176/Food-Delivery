import express from 'express'
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js'
import { authMiddleware } from '../middleware/auth.js'

const cartRouter = express.Router()

cartRouter.post('/add/:id', authMiddleware, addToCart)
cartRouter.post('/remove/:id', authMiddleware, removeFromCart)
cartRouter.get('/get/:id', authMiddleware, getCart)

export default cartRouter