import axios from "axios"

// AUTH HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Generate Access Token
export const generateAccessTokenHook = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/generate-access-token`, {
            headers: {
                'x-request-source': 'admin'
            }
        })
        return response

    } catch (error: any) {
        console.error(error)
        return error.response
    }
}


// Login / Sign-Up (Covers both)
export const loginSignupHook = async (data: object, action: string) => { // , updateAuthState, setShowLogin

    try {
        const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/auth/' + (action === "login" ? '' : 'admin-') + action, data, {
            headers: {
                'x-request-source': 'admin'
            }
        })
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
        const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/auth/logout', {
            headers: {
                'x-request-source': 'admin'
            }
        })
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
