import express from 'express'
import { addToCart, removeFromCart, getCart } from '../controllers/cartController'
import { authMiddleware } from '../middleware/auth'

const cartRouter = express.Router()

cartRouter.post('/add/:id', authMiddleware, addToCart)
cartRouter.post('/remove/:id', authMiddleware, removeFromCart)
cartRouter.get('/get/:id', authMiddleware, getCart)

export default cartRouter