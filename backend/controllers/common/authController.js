import jwt from "jsonwebtoken"
import { createAccessToken } from "../../helpers/helper.js"

// GENERATE ACCESS TOKEN (Common)
const generateAccessToken = (req, res, next) => {

    console.log("\n IN ACCESS TOKEN GENERATION --------------------------- \n")

    try {
        const { refreshToken } = req.cookies
        console.log("Refresh Token: " + refreshToken)

        if (!refreshToken) return res.status(200).json({ success: false, message: "Please log in to obtain a new token" })

        // Determine the secret key based on the request origin
        const isAdmin = Boolean(req.headers['x-request-source'] === 'admin')
        const secretKey = isAdmin ? process.env.ADMIN_REFRESH_TOKEN_SECRET : process.env.FRONTEND_REFRESH_TOKEN_SECRET

        // Verify the refreshToken, returning an error if expired
        jwt.verify(refreshToken, secretKey, (err, decoded) => {
            if (err) return res.status(403).json({ success: false, error: "Refresh token is not valid" })

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

// const generateAccessToken = (req, res) => {

//     console.log("\n IN ACCESS TOKEN GENERATION --------------------------- \n")

//     try {
//         const {refreshToken} = req.cookies
//         console.log("Refresh Token: " + refreshToken)
    
//         // If no refreshToken found, return an error
//         if (!refreshToken) return res.status(200).json({success: false, message: "Please log in to obtain a new token"})
    
//         // Verify the refreshToken, returning an error if expired
//         jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
//             if (err) return res.status(403).json({success: false, error: "Refresh token is not valid"})
    
//             // If valid, generate and return a new accessToken
//             const accessToken = createAccessToken({id: decoded.user.id})
//             return res.status(200).json({success: true, accessToken})
//         })
        
//     } catch (error) {

//         console.log("\n ERROR IN ACCESS TOKEN GENERATION --------------------------- \n")
//         console.log(error)

//         error.action = "Generating Access Token"
//         next(error)
//     }
// }

export {
    generateAccessToken
}

