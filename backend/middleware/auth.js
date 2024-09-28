import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
    console.log("\n IN AUTH MIDDLEWARE --------------------------- \n")
    const { token } = req.headers // req.cookies

    // const authHeader = req.headers.authorization
    // const token = authHeader && authHeader.split(' ')[1]

    try {
        // If no Access Token
        if(!token) throw { status: 401, message: 'User is not authorized' }
        
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decoded.id
        
        next()
    } catch (error) {

        console.log("ERROR IN AUTH MIDDLEWARE")
        console.error(error)

        next(error)
    }
}
