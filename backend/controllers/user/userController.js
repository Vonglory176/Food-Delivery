import userModel from "../../models/userModel.js"
import bcrypt from 'bcrypt'
import validator from 'validator'
import { sendLoginDetails } from "../../helpers/helper.js"

// Login User
const userLogin = async (req, res, next) => {
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

        sendLoginDetails(res, user, false) // False for user, true for admin

        console.log("User logged in successfully")

    } catch (error) {

        console.log("\n ERROR IN LOGIN USER --------------------------- \n")
        console.log(error)

        error.action = "Logging In"
        next(error)
    }
}

// Register User
const userRegister = async (req, res, next) => {
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
        // const token = createAccessToken(newUser)

        sendLoginDetails(res, newUser)

        console.log("User created successfully")

    } catch (error) {

        console.log("\n ERROR IN REGISTER USER --------------------------- \n")
        console.log(error)

        error.action = "Registering User"
        next(error)
    }
}


// Logout User
const userLogout = async (req, res, next) => {
    console.log("\n IN LOGOUT USER --------------------------- \n")
    
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true, 
            path: "/", 
            secure: process.env.USE_HTTPS === "true", 
            sameSite: process.env.SAME_SITE || 'Lax' // CHANGE FOR PRODUCTION
        })
        res.status(200).json({success: true, message: "User logged out successfully"})

    } catch (error) {

        console.log("\n ERROR IN LOGOUT USER --------------------------- \n")
        console.log(error)

        error.action = "Logging Out"
        next(error)
    }
}

export {
    userLogin,
    userRegister,
    userLogout
}


