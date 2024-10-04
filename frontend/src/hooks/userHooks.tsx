import axios from "axios"

// USER HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Login / Sign-Up (Covers both)
export const loginSignupHook = async (data: object, action: string) => { // , updateAuthState, setShowLogin

    try {
        const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/user/' + action, data)
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
        const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/user/logout')
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
