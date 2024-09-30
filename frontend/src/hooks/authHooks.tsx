import axios from "axios"

// AUTH HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Generate Access Token
export const generateAccessTokenHook = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/generate-access-token`)
        return response.data

    } catch (error) {
        console.error(error)
        return error.response
    }
}
