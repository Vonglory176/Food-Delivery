import jwt from 'jsonwebtoken'
// import userModel from '../models/userModel.js'
import adminModel from '../models/adminModel.js'

// This is for fetch calls that always need the user to be logged-in
export const authMiddleware = (req, res, next) => {

    // Getting Auth-Token
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    // Determine the secret key based on the request origin
    const isAdmin = Boolean(req.headers['x-request-source'] === 'admin')
    const secretKey = isAdmin ? process.env.ADMIN_ACCESS_TOKEN_SECRET : process.env.FRONTEND_ACCESS_TOKEN_SECRET
    // console.log("Secret Key: " + isAdmin ? 'ADMIN' : 'FRONTEND' )
    
    // Update REQ for isAdmin
    req.body.isAdmin = isAdmin

    console.log("\n IN JWT AUTHENTICATION MIDDLEWARE --------------------------- \n")
    
    try {
        
        // If no Access Token
        if(!token) throw { status: 401, message: 'User is not authorized' }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) console.log(err)
            if (err) throw { status: 403, message: 'Verification failed' }

            req.body.userId = decoded.user.id // Attatch the user_id to the request object

            next() // If no error, move on to the next function in the Route
        })
        
    } catch (error) {

        console.log("\n ERROR IN JWT AUTH MIDDLEWARE ---------------------------------- \n")
        // console.error(error)

        next(error)
    }
}

export const demoMiddleware = async (req, res, next) => {
    console.log("\n IN DEMO-MODE MIDDLEWARE --------------------------- \n")
    // console.log(req.body, req.params, req.query)

    try {
        // console.log(req.body)
        const { userId, isAdmin } = req.body

        if (isAdmin) {

            const user = await adminModel.findById(userId)
            console.log(user.demo)

            if (!user) throw { status: 404, clientMessage: 'User not found' }
            if (user.demo) throw { status: 403, clientMessage: 'User is in Demo-Mode and cannot perform this action' }
        }



        next()

    } catch (error) {
        console.log("\n ERROR IN DEMO-MODE MIDDLEWARE ---------------------------------- \n")
        console.log(error)
        error.action = "Checking if in Demo-Mode"
        next(error)
    }
}
