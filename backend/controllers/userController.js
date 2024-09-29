import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { createAccessToken, createRefreshToken, sendLoginDetails } from "../helpers/helper.js"

// Login User
const loginUser = async (req, res, next) => {
    console.log("\n IN LOGIN USER --------------------------- \n")
    const { email, password } = req.body

    const requiredFields = ['email', 'password']

    try {
        // Check if all required fields are present
        if (!requiredFields.every(field => field in req.body)) {
            throw { status: 400, clientMessage: 'Missing required fields' }
        }

        // Validating Email
        if (!validator.isEmail(email)) return res.status(400).json({success: false, error: {
            type: "email",
            message: "Invalid email"
        }})

        // Check if user exists and password matches
        const user = await userModel.findOne({ email })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({success: false, error: {
                type: "email",
                message: "Email or password is incorrect"
            }})
        }

        // const token = createAccessToken(user)
        // res.status(200).json({ success: true, token })

        sendLoginDetails(res, user)

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
const registerUser = async (req, res, next) => {
    console.log("\n IN REGISTER USER --------------------------- \n")
    const { name, email, password } = req.body

    const requiredFields = ['name', 'email', 'password']

    try {
        // Check if all required fields are present
        if (!requiredFields.every(field => field in req.body)) {
            return res.status(400).json({success: false, error: {
                type: "fields",
                message: "Missing required fields"
            }})
        }

        // Check if user already exists
        const exists = await userModel.findOne({ email })
        if (exists) return res.status(409).json({success: false, error: {
            type: "email",
            message: "Existing user found with the same email"
        }})
        
        // Validating Name & Email & Password
        if (typeof req.body.name !== 'string' || !validator.isAlpha(req.body.name.replace(/\s/g, ''))) return res.status(400).json({success: false, error: {
            type: "name",
            message: "Invalid name. Only letters and spaces are allowed."
        }})
        if (!validator.isEmail(email)) return res.status(400).json({success: false, error: {
            type: "email",
            message: "Invalid email"
        }})
        if (!validator.isStrongPassword(password)) return res.status(400).json({success: false, error: {
            type: "password",
            message: "Password is not strong enough"
        }})

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
        const token = createAccessToken(newUser)

        // res.status(200).json({
        //     success: true, 
        //     token: token
        // })

        sendLoginDetails(res, newUser)

        console.log("User created successfully")

    } catch (error) {

        console.log("\n ERROR IN REGISTER USER --------------------------- \n")
        console.log(error)

        error.action = "Registering User"
        next(error)
    }
}

// Generate Access Token
const generateAccessToken = (req, res) => {

    console.log("\n IN ACCESS TOKEN GENERATION --------------------------- \n")

    try {
        const {refreshToken} = req.cookies
        console.log("Refresh Token: " + refreshToken)
    
        // If no refreshToken found, return an error
        // if (!refreshToken) return res.status(403).json({success: false, error: "No refresh token found"})
        // if (!refreshToken) return res.status(403).json({success: false, message: "User is not logged in"})
        if (!refreshToken) return res.status(200).json({success: false, message: "Please log in to obtain a new token"})
    
        // Verify the refreshToken, returning an error if expired
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({success: false, error: "Refresh token is not valid"})
    
            // If valid, generate and return a new accessToken
            const accessToken = accessTokenHelper({id: decoded.user.id})
            return res.status(200).json({success: true, accessToken})
        })
        
    } catch (error) {

        console.log("\n ERROR IN ACCESS TOKEN GENERATION --------------------------- \n")
        console.log(error)

        error.action = "Generating Access Token"
        next(error)
    }
}

export {
    loginUser,
    registerUser,
    generateAccessToken
}


