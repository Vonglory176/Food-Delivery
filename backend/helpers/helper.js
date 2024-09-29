import jwt from 'jsonwebtoken'

// export const createAccessToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
// }

// Site Token Generation
const createAccessToken = (user) => {
    return jwt.sign({ user: { id: user.id } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}

const createRefreshToken = (user) => {
    return jwt.sign({ user: { id: user.id } }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

// const createVerificationToken = (user) => {
//     return jwt.sign({ userId: user._id }, process.env.EMAIL_TOKEN_SECRET, { expiresIn: '1d' }) // 1 day expiration
// }

// const createPasswordResetToken = (user) => {
//     return jwt.sign({ userId: user._id }, process.env.PASSWORD_TOKEN_SECRET, { expiresIn: '1h' }) // 1 hour expiration
// }



// Send Login Details ( Post login/sign-Up logic)
const sendLoginDetails = (res, user) => {

    // Generate a new set of tokens
    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken(user)
    
    // Send the refreshToken in an HttpOnly cookie
    res.cookie('refreshToken', refreshToken, { 
        httpOnly: true, 
        path:"/", 
        secure: process.env.USE_HTTPS === "true",
        sameSite: process.env.SAME_SITE || 'Lax', // CHANGE FOR PRODUCTION
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // signed: true
    }) 
    
    // Send the accessToken in a successful response
    res.status(200).json({ 
        success: true,
        user: user.username, 
        accessToken
    })
}



export { 
    createAccessToken, 
    createRefreshToken,
    sendLoginDetails
}