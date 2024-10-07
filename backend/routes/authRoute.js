import express from 'express'
import { generateAccessToken, accountLogout, accountLogin, accountRegister } from '../controllers/common/authController.js'
import { authMiddleware, demoMiddleware } from '../middleware/auth.js'

const authRouter = express.Router()

// User routes
authRouter.post('/register', accountRegister)

// Admin routes
authRouter.post('/admin-register', authMiddleware, demoMiddleware, accountRegister)

// Common routes
authRouter.get('/generate-access-token', generateAccessToken)
authRouter.post('/login', accountLogin)
authRouter.post('/logout', accountLogout)

export default authRouter