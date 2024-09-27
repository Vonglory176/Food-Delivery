import userModel from "../models/userModel"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { createAccessToken } from "../helpers/helper"

// Login User
export const loginUser = async (req, res) => {
    console.log("\n IN LOGIN USER --------------------------- \n")
    const { email, password } = req.body

    const requiredFields = ['email', 'password']

    try {
        // Check if all required fields are present
        if (!requiredFields.every(field => field in req.body)) {
            throw { status: 400, clientMessage: 'Missing required fields' }
        }

        // Validating Email
        if (!validator.isEmail(email)) throw { status: 400, clientMessage: 'Invalid email' }

        // Check if user exists and password matches
        const user = await userModel.findOne({ email })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw { status: 400, clientMessage: 'Email or password is incorrect' }
        }

        const token = createAccessToken(user._id)
        res.status(200).json({ success: true, token })

        console.log("User logged in successfully")

    } catch (error) {

        console.log("\n ERROR IN LOGIN USER --------------------------- \n")
        console.log(error)

        error.action = "Logging In"
        next(error)
    }
}

// const createToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
// }

// Register User
export const registerUser = async (req, res) => {
    console.log("\n IN REGISTER USER --------------------------- \n")
    const { name, email, password } = req.body

    const requiredFields = ['name', 'email', 'password']

    try {
        // Check if all required fields are present
        if (!requiredFields.every(field => field in req.body)) {
            throw { status: 400, clientMessage: 'Missing required fields' }
        }

        // Check if user already exists
        const exists = await userModel.findOne({ email })
        if (exists) throw { status: 400, clientMessage: 'User already exists' }
        
        // Validating Name & Email & Password
        if (typeof req.body.name !== 'string' || !validator.isAlpha(req.body.name.replace(/\s/g, ''))) throw { status: 400, clientMessage: 'Invalid name' }
        if (!validator.isEmail(email)) throw { status: 400, clientMessage: 'Invalid email' }
        if (!validator.isStrongPassword(password)) throw { status: 400, clientMessage: 'Password is not strong enough' }

        // Hashing Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Creating User
        const user = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const newUser = await user.save()
        const token = createAccessToken(newUser._id)

        res.status(200).json({
            success: true, 
            token: token
        })

        console.log("User created successfully")

    } catch (error) {

        console.log("\n ERROR IN REGISTER USER --------------------------- \n")
        console.log(error)

        error.action = "Registering User"
        next(error)
    }
}