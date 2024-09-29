import axios from "axios"

// USER HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Login / Sign-Up (Covers both)
export const loginHook = async (data: any, action: 'register' | 'login', updateAuthState, setShowLogin, setErrors) => { // setToken: React.Dispatch<React.SetStateAction<string | null>>

    try {
        const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/user/' + action, data)
        console.log(response)

        if (response.data.success) {
            // updateAuthState({accessToken: response.data.accessToken, user: response.data.user})
            setShowLogin(false)
        }
    }
    catch (error: any) {
        console.error(error)
        // console.error("ERROR: Could not login")

        const {type="email", message="Internal Server Error"} = error?.response?.data?.error
        setErrors(prev => ({...prev, [type]: message}))
    }
}

// Logout
export const logoutHook = async (updateAuthState) => {
    try {
        const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/user/logout')
        console.log(response)

        // Optionally check response status
        if (response.status !== 200) throw new Error("Server-side logout failed: " + response.status)
    }
    catch (error) {
        console.error(error)
        console.error("ERROR: Could not logout")
    }

    updateAuthState({accessToken: null, user: null})
}
