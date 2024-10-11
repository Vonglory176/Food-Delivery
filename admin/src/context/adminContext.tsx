import { createContext, useContext, useEffect, useState } from "react";
// import { getFoodHook } from "../hooks/foodHooks";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { generateAccessTokenHook, loginSignupHook, logoutHook } from "../hooks/authHooks";
import { getOrdersHook, updateOrderStatusHook } from "../hooks/orderHooks";
import { addFoodHook, getFoodHook, removeFoodHook } from "../hooks/foodHooks";
import { toast } from "react-toastify";
// import { generateAccessTokenHook } from "../hooks/authHooks";

const AdminContext = createContext<AdminContextType>({ // Specify the type here

    showLogin: false,
    setShowLogin: () => { },

    isLoggedIn: Boolean(sessionStorage.getItem('accessToken')),
    setIsLoggedIn: () => { },

    isLoading: true,
    setIsLoading: () => { },

    isDemoMode: Boolean(sessionStorage.getItem('demoMode')),

    userLoginSignup: async () => { },
    userLogout: async () => { }, // Update to match the expected type

    foodList: [],
    getFood: async () => { },
    addFood: async () => { },
    removeFood: async () => { },

    getOrders: async () => { },
    updateOrderStatus: async () => { },
})

export const useAdmin = () => useContext(AdminContext)






const AdminContextProvider: React.FC<AdminContextProviderProps> = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(sessionStorage.getItem('accessToken')))
    const [isDemoMode, setIsDemoMode] = useState<boolean>(Boolean(sessionStorage.getItem('demoMode')))
    const [showLogin, setShowLogin] = useState<boolean>(false)

    const [foodList, setFoodList] = useState<any>([])

    // useEffect(() => {
    //     console.log(cartItems)
    // }, [cartItems])

    const demoModeToastError = () => toast.info("This feature is disabled while in Demo-Mode")


    // INITIAL FETCHES ////////////////////////////////////////////////////////////////////////////////////////////////

    // LOGIN / FOOD SYNC ---
    useEffect(() => {

        // const fetchFoodList = async () => {
        //         console.log("Fetching Food List")
        //         await getFoodHook(setFoodList)
        // }

        const maintainLoginStatus = async () => {

            // Is AccessToken in Session Storage?
            if (sessionStorage.getItem('accessToken')) {
                const success = await generateAccessToken()

                // If failure (403 Response), logout
                if (!success) userLogout()
            }
        }

        // if (foodList.length === 0) fetchFoodList() // Fire if foodList is empty
        maintainLoginStatus()

    }, [location.pathname])

    // FOOD ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

    // GET FOOD
    const getFood = async () => {
        setIsLoading(true)

        const response = await getFoodHook()

        if (response?.data.success) {
            setFoodList(response.data.foodList)
        }
        else {
            // setFoodList([])
            toast.error("Error! Couldn't fetch food-list")
        }

        setIsLoading(false)
    }

    // ADD FOOD
    const addFood = async (formData: FormData, resetForm: () => void): Promise<void> => {

        if (isDemoMode) demoModeToastError()

        else {
            const response = await addFoodHook(authCustomFetch, formData)
            const { success, message } = response.data

            // Reset form + Popup + Update Food List
            if (success) {
                resetForm()
                toast.success(message)
                getFood()
            }
            else toast.error(message)
        }
    }

    // REMOVE FOOD
    const removeFood = async (foodId: string): Promise<void> => {

        if (isDemoMode) demoModeToastError()

        else {
            const response = await removeFoodHook(authCustomFetch, foodId)
            const { success, message } = response.data

            // Popup + Update Food List
            if (success) {
                toast.success(message)
                getFood()
            }
            else toast.error(message)
        }

    }


    // USER ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

    // LOGIN / SIGNUP
    const userLoginSignup = async (data: any, action: LoginAction, setErrors: React.Dispatch<React.SetStateAction<any>>) => {
        console.log("Logging in")

        // Getting data via Hook
        const response = await loginSignupHook(data, action)

        if (response?.data?.success) {
            const { accessToken, demoMode } = response.data
            updateAuthState({ accessToken })
            setShowLogin(false)
            setIsLoggedIn(true)

            // Setting demo-mode (NEVER UPDATES BEYOND FIRST LOGIN)
            if (demoMode) {
                setIsDemoMode(true)
                sessionStorage.setItem('demoMode', 'true')
            }
        }
        else {
            const type = response?.data?.error?.type || "email"
            const message = response?.data?.error?.message || "Internal Server Error"
            // console.log(type, message)

            // const {type="email", message="Internal Server Error"} = error?.response?.data?.error


            setErrors((prevErrors: object) => ({ ...prevErrors, [type]: message }))
        }
    }

    // LOGOUT
    const userLogout = async () => {
        await logoutHook()
        updateAuthState({ accessToken: null })

        setIsDemoMode(false)
        sessionStorage.removeItem('demoMode')

        navigate("/")
    }


    // AUTH STATE ////////////////////////////////////////////////////////////////////////////////////////////////    

    // TOKEN STATE UPDATE - (Access Token in Session Storage)
    const updateAuthState = ({ accessToken }: { accessToken: string | null }) => {
        console.log("Updating Auth State!") // , data
        // console.log(accessToken)

        // If a token is given, save it. Otherwise remove it
        if (accessToken) sessionStorage.setItem('accessToken', accessToken)
        else sessionStorage.removeItem('accessToken')

        // Update the session state
        setIsLoggedIn(Boolean(accessToken))
        // console.log("Information Updated!")
    }

    // TOKEN GENERATION (For getting/refreshing the sessions access token)
    const generateAccessToken = async () => {
        console.log("Generating Access Token")

        // Making the request
        const response = await generateAccessTokenHook()
        console.log(response)

        // If 403 FORBIDDEN, logout the user
        if (!response?.data.success) return false
        // if (response.status === 403) return false

        const newAccessToken = response?.data?.accessToken || null
        // console.log(newAccessToken)

        // const user = response?.data?.user || null

        // if (newAccessToken && user) updateAuthState({ accessToken: newAccessToken, user })
        if (newAccessToken) updateAuthState({ accessToken: newAccessToken })

        return true
    }

    // CUSTOM FETCH CALL FOR AUTHORIZATION REQUIREMENTS
    // This function is used to make a request where, if failed due to expired/missing access token,
    // a second request is made to refresh the token before then retrying the original request again
    async function authCustomFetch(url: string, options: CustomFetchOptions) {

        // console.log(options)

        // Inject the Authorization header with the access token
        const accessToken = sessionStorage.getItem('accessToken')
        if (accessToken) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`
            }
        }

        let response
        try {

            // PRIMARY REQUEST ---
            response = await axios({ url, ...options })
            console.log(response)

        } catch (error: any) {

            // TOKEN REFRESH REQUEST --- (If unauthorized, try refreshing the token and retrying the request once)
            if (error.response.status === 403) {

                const success = await generateAccessToken()
                const newAccessToken = sessionStorage.getItem('accessToken')

                // RE-TRY REQUEST --- (If a new token was given, re-send the request)
                if (success && newAccessToken) {
                    options.headers.Authorization = `Bearer ${newAccessToken}`
                    response = await axios({ url, ...options, withCredentials: true })
                    // console.log(response)
                }
                else {
                    // RE-TRY FAILED --- (Refresh-token was lost/expired, logout user)
                    userLogout()
                }
            }
            // Non-403 Error
            else return error.response
        }

        return response
    }

    // ORDER ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

    // GET ORDERS ---
    const getOrders = async (setOrders: React.Dispatch<React.SetStateAction<any>>) => {
        // setIsLoading(true)

        const response = await getOrdersHook(authCustomFetch)
        const { success, message, orderList } = response.data

        // Popup + Update Food List
        if (success) setOrders(orderList)
        else toast.error(message)

        setIsLoading(false)
    }

    // UPDATE ORDER ---
    const updateOrderStatus = async (status: string, orderId: string, setOrders: React.Dispatch<React.SetStateAction<any>>) => {
        const response = await updateOrderStatusHook(authCustomFetch, orderId, status)
        const { success, message } = response.data

        if (success) {
            getOrders(setOrders)
        }
        else toast.error(message)
    }

    // EXPORT ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const contextValue: AdminContextType = {

        showLogin,
        setShowLogin,

        isLoading,
        setIsLoading,

        isLoggedIn,
        setIsLoggedIn,

        isDemoMode,

        userLoginSignup,
        userLogout,

        foodList,
        getFood,
        addFood,
        removeFood,

        getOrders,
        updateOrderStatus

        // authCustomFetch: (url, options) => authCustomFetch(url, options, generateAccessToken),
        // updateAuthState
    }

    return <AdminContext.Provider value={contextValue}>
        {children}
    </AdminContext.Provider>
}




export default AdminContextProvider