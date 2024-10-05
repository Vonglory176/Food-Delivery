import jwt from 'jsonwebtoken'

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