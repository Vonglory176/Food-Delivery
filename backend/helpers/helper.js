import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

// export const createAccessToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
// }

// Site Token Generation
const createAccessToken = (user, isAdmin = false) => {
    const secretKey = isAdmin ? process.env.ADMIN_ACCESS_TOKEN_SECRET : process.env.FRONTEND_ACCESS_TOKEN_SECRET
    return jwt.sign({ user: { id: user.id } }, secretKey, { expiresIn: isAdmin? '15m' : '1h' })
}

const createRefreshToken = (user, isAdmin = false) => {
    const secretKey = isAdmin ? process.env.ADMIN_REFRESH_TOKEN_SECRET : process.env.FRONTEND_REFRESH_TOKEN_SECRET
    return jwt.sign({ user: { id: user.id } }, secretKey, { expiresIn: isAdmin? '1h' : '7d' })
}

// const createVerificationToken = (user) => {
//     return jwt.sign({ userId: user._id }, process.env.EMAIL_TOKEN_SECRET, { expiresIn: '1d' }) // 1 day expiration
// }

// const createPasswordResetToken = (user) => {
//     return jwt.sign({ userId: user._id }, process.env.PASSWORD_TOKEN_SECRET, { expiresIn: '1h' }) // 1 hour expiration
// }



// Send Login Details ( Post login/sign-Up logic)
const sendLoginDetails = (res, user, isAdmin = false) => {

    // Generate a new set of tokens
    const accessToken = createAccessToken(user, isAdmin)
    const refreshToken = createRefreshToken(user, isAdmin)
    
    // Send the refreshToken in an HttpOnly cookie
    const refreshTokenName = isAdmin ? 'adminRefreshToken' : 'refreshToken'
    res.cookie(refreshTokenName, refreshToken, { 
        httpOnly: true, 
        path: isAdmin ? '/admin/' : '/', 
        secure: true, // process.env.USE_HTTPS || true,
        sameSite: process.env.SAME_SITE || 'Lax', // CHANGE FOR PRODUCTION
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // signed: true
    }) 

    // Build the response object
    const response = { 
        success: true,
        username: user.username,
        accessToken
    }

    // For saving demo status
    if (isAdmin && user.demo) response.demoMode = true
    
    // Send the accessToken in a successful response
    res.status(200).json(response)
}

const convertToObjectId = (id) => {
    try {
        return new mongoose.Types.ObjectId(String(id))
    } 
    catch (error) {
        console.log(error)
        return null
    }
}


export { 
    createAccessToken, 
    createRefreshToken,
    sendLoginDetails,
    convertToObjectId
}