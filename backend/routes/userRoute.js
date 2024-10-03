import express from 'express'
// import { loginUser, registerUser } from '../controllers/test.js'
import { userLogin, userRegister, userLogout } from '../controllers/user/userController.js'
import { generateAccessToken } from '../controllers/common/authController.js'

const userRouter = express.Router()

// User routes
userRouter.post('/login', userLogin)
userRouter.post('/register', userRegister)
userRouter.post('/logout', userLogout)

// Admin routes

// Common routes
userRouter.get('/generate-access-token', generateAccessToken)

export default userRouter