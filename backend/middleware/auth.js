import jwt from 'jsonwebtoken'

// This is for fetch calls that always need the user to be logged-in
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    console.log("\n IN JWT AUTHENTICATION MIDDLEWARE --------------------------- \n")
    
    try {
        
        // If no Access Token
        if(!token) throw { status: 401, message: 'User is not authorized' }

        jwt.verify(token, process.env.FRONTEND_ACCESS_TOKEN_SECRET, (err, decoded) => {
            // if (err) console.log(err)
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