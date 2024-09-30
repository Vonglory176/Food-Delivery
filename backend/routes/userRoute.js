import express from 'express'
// import { loginUser, registerUser } from '../controllers/test.js'
import { loginUser, registerUser, logoutUser, generateAccessToken } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/login', loginUser)
userRouter.post('/register', registerUser)
userRouter.post('/logout', logoutUser)
userRouter.get('/generate-access-token', generateAccessToken)

export default userRouter