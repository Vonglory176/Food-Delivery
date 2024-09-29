import jwt from 'jsonwebtoken'

// export const authMiddleware = async (req, res, next) => {
//     console.log("\n IN AUTH MIDDLEWARE --------------------------- \n")
//     const { token } = req.headers // req.cookies

//     // const authHeader = req.headers.authorization
//     // const token = authHeader && authHeader.split(' ')[1]

//     try {
//         // If no Access Token
//         if(!token) throw { status: 401, message: 'User is not authorized' }
        
//         const token_decoded = jwt.verify(token, process.env.JWT_SECRET)
//         req.body.userId = token_decoded.id
        
//         next()
//     } catch (error) {

//         console.log("ERROR IN AUTH MIDDLEWARE")
//         console.error(error)

//         next(error)
//     }
// }

// This is for fetch calls that always need the user to be logged-in
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    console.log("\n IN JWT AUTHENTICATION MIDDLEWARE --------------------------- \n")
    
    try {
        
        // If no Access Token
        if(!token) throw { status: 401, message: 'User is not authorized' }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) throw { status: 403, message: 'Verification failed' }

            req.body.user_id = decoded.user.id // Attatch the user_id to the request object

            next() // If no error, move on to the next function in the Route
        })
        
    } catch (error) {

        console.log("\n ERROR IN JWT AUTH MIDDLEWARE ---------------------------------- \n")
        // console.error(error)

        next(error)
    }
}