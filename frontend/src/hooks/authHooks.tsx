import axios from "axios"

// AUTH HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Generate Access Token
export const generateAccessTokenHook = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/generate-access-token`)
        return response

    } catch (error: any) {
        console.error(error)
        return error.response
    }
}

// Login / Sign-Up (Covers both)
export const loginSignupHook = async (data: object, action: string) => { // , updateAuthState, setShowLogin

    try {
        const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/auth/' + action, data)
        console.log(response)

        return response
    }
    catch (error: any) {
        console.error(error)
        return error.response
    }
}

// Logout
export const logoutHook = async () => { // updateAuthState
    try {
        const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/auth/logout')
        console.log(response)

        // Optionally check response status
        if (response.status !== 200) throw new Error("Server-side logout failed: " + response.status)

        return response
    }
    catch (error: any) {
        console.error(error)
        return error.response
    }
}