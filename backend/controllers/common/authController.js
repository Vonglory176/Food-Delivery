import jwt from "jsonwebtoken"
import { createAccessToken } from "../../helpers/helper.js"
import userModel from "../../models/userModel.js"
import adminModel from "../../models/adminModel.js"
import bcrypt from 'bcrypt'
import validator from 'validator'
import { sendLoginDetails } from "../../helpers/helper.js"

// GENERATE ACCESS TOKEN (Common)
const generateAccessToken = (req, res, next) => {

    console.log("\n IN ACCESS TOKEN GENERATION --------------------------- \n")

    try {
        // Grab both refresh tokens, only use one
        const { refreshToken, adminRefreshToken } = req.cookies
        console.log("Refresh Token: " + refreshToken)
        console.log("Admin Refresh Token: " + adminRefreshToken)
        
        const isAdmin = Boolean(req.headers['x-request-source'] === 'admin')
        if ((!isAdmin && !refreshToken) || (isAdmin && !adminRefreshToken)) return res.status(200).json({ success: false, message: "Please log in to obtain a new token" })
            
        // Determine the secret key based on the request origin
        const secretKey = isAdmin ? process.env.ADMIN_REFRESH_TOKEN_SECRET : process.env.FRONTEND_REFRESH_TOKEN_SECRET
        const selectedToken = isAdmin ? adminRefreshToken : refreshToken

        // Verify the refreshToken, returning an error if expired
        jwt.verify(selectedToken, secretKey, (err, decoded) => {
            if (err) {
                console.log("Error in Refresh Token Verification:" + err)
                return res.status(403).json({ success: false, error: "Refresh token is not valid" })
            }

            // If valid, generate and return a new accessToken
            const accessToken = createAccessToken({ id: decoded.user.id }, isAdmin)
            return res.status(200).json({ success: true, accessToken })
        })

    } catch (error) {

        console.log("\n ERROR IN ACCESS TOKEN GENERATION --------------------------- \n")
        console.log(error)

        error.action = "Generating Access Token"
        next(error)
    }
}

// Register Account
const accountRegister = async (req, res, next) => {
    console.log("\n IN REGISTER ACCOUNT --------------------------- \n")
    const { name, email, password, demo } = req.body
    // console.log(req.originalUrl)

    // Admin related checks
    let isAdmin = false
    if (Boolean(req.headers['x-request-source'] === 'admin') && req.originalUrl === '/api/auth/admin-register') {
        const reqAdmin = await adminModel.findById(req.body.userId)

        // If not found OR is demo
        if (!reqAdmin || reqAdmin.demo) return res.status(403).json({success: false, error: { type: "general", message: "Permission denied"}})
        else isAdmin = true
    }

    const requiredFields = ['name', 'email', 'password']

    try {
        // Check if all required fields are present
        if (!requiredFields.every(field => field in req.body)) {
            return res.status(400).json({success: false, error: {
                type: "general",
                message: "Missing required fields"
            }})
        }

        // Check if user already exists
        const lowercaseEmail = email.toLowerCase()
        const exists = await isAdmin ? adminModel.findOne({ email: lowercaseEmail }) : userModel.findOne({ email: lowercaseEmail })
        if (exists) return res.status(409).json({success: false, error: {
            type: "email",
            message: "Existing user found with the same email"
        }})
        
        // Validating Name & Email & Password
        if (typeof req.body.name !== 'string' || !validator.isAlpha(req.body.name.replace(/\s/g, '')) || req.body.name.length < 3) return res.status(400).json({success: false, error: {
            type: "name",
            message: "Invalid name. Only letters and spaces are allowed. Minimum 3 characters."
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

        // Creating Account
        const commonAccountDetails = {
            name,
            email: lowercaseEmail,
            password: hashedPassword
        }
        
        // Admin / User
        const Model = isAdmin ? adminModel : userModel
        const account = new Model({
            ...commonAccountDetails,
            ...(isAdmin && { demo })
        })

        const newAccount = await account.save()

        sendLoginDetails(res, newAccount, isAdmin)

        console.log("Account created successfully")

    } catch (error) {

        console.log("\n ERROR IN REGISTER ACCOUNT --------------------------- \n")
        console.log(error)

        error.action = "Registering Account"
        next(error)
    }
}

// Login Account 
const accountLogin = async (req, res, next) => {
    console.log("\n IN LOGIN ACCOUNT --------------------------- \n")
    const { email, password } = req.body

    const requiredFields = ['email', 'password']

    // Determine the secret key based on the request origin
    const isAdmin = Boolean(req.headers['x-request-source'] === 'admin')
    console.log("\nIs Admin: " + isAdmin + "\n")

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
        const lowercaseEmail = email.toLowerCase()
        const account = isAdmin ? await adminModel.findOne({ email: lowercaseEmail }) : await userModel.findOne({ email: lowercaseEmail })
        if (!account || !(await bcrypt.compare(password, account.password))) {
            return res.status(400).json({success: false, error: {
                type: "email",
                message: "Email or password is incorrect"
            }})
        }

        sendLoginDetails(res, account, isAdmin) // False for user, true for admin

        console.log("Account logged in successfully")

    } catch (error) {

        console.log("\n ERROR IN LOGIN ACCOUNT --------------------------- \n")
        console.log(error)

        error.action = "Logging In"
        next(error)
    }
}

// Logout Account
const accountLogout = async (req, res, next) => {
    console.log("\n IN LOGOUT ACCOUNT --------------------------- \n")
    const isAdmin = Boolean(req.headers['x-request-source'] === 'admin')
    
    try {
        const refreshTokenName = isAdmin ? 'adminRefreshToken' : 'refreshToken'
        res.clearCookie(refreshTokenName, {
            httpOnly: true, 
            path: "/", 
            secure: process.env.USE_HTTPS === "true", 
            sameSite: process.env.SAME_SITE || 'Lax' // CHANGE FOR PRODUCTION
        })
        res.status(200).json({success: true, message: "User logged out successfully"})

    } catch (error) {

        console.log("\n ERROR IN LOGOUT ACCOUNT --------------------------- \n")
        console.log(error)

        error.action = "Logging Out"
        next(error)
    }
}

export {
    generateAccessToken,
    accountRegister,
    accountLogin,
    accountLogout
}








// import userModel from "../../models/userModel.js"
// import bcrypt from 'bcrypt'
// import validator from 'validator'
// import { sendLoginDetails } from "../../helpers/helper.js"

// // Register User
// const userRegister = async (req, res, next) => {
//     console.log("\n IN REGISTER USER --------------------------- \n")
//     const { name, email, password } = req.body

//     const requiredFields = ['name', 'email', 'password']

//     try {
//         // Check if all required fields are present
//         if (!requiredFields.every(field => field in req.body)) {
//             return res.status(400).json({success: false, error: {
//                 type: "fields",
//                 message: "Missing required fields"
//             }})
//         }

//         // Check if user already exists
//         const exists = await userModel.findOne({ email })
//         if (exists) return res.status(409).json({success: false, error: {
//             type: "email",
//             message: "Existing user found with the same email"
//         }})
        
//         // Validating Name & Email & Password
//         if (typeof req.body.name !== 'string' || !validator.isAlpha(req.body.name.replace(/\s/g, ''))) return res.status(400).json({success: false, error: {
//             type: "name",
//             message: "Invalid name. Only letters and spaces are allowed."
//         }})
//         if (!validator.isEmail(email)) return res.status(400).json({success: false, error: {
//             type: "email",
//             message: "Invalid email"
//         }})
//         if (!validator.isStrongPassword(password)) return res.status(400).json({success: false, error: {
//             type: "password",
//             message: "Password is not strong enough"
//         }})

//         // Hashing Password
//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(password, salt)

//         // Creating User
//         const user = new userModel({
//             name: name,
//             email: email,
//             password: hashedPassword
//         })

//         const newUser = await user.save()
//         // const token = createAccessToken(newUser)

//         sendLoginDetails(res, newUser)

//         console.log("User created successfully")

//     } catch (error) {

//         console.log("\n ERROR IN REGISTER USER --------------------------- \n")
//         console.log(error)

//         error.action = "Registering User"
//         next(error)
//     }
// }

// export {
//     userRegister    
// }