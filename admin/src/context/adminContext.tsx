import { createContext, useContext, useEffect, useState } from "react";
// import { getFoodHook } from "../hooks/foodHooks";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { generateAccessTokenHook, loginSignupHook, logoutHook } from "../hooks/authHooks";
import { getOrdersHook } from "../hooks/orderHooks";
// import { generateAccessTokenHook } from "../hooks/authHooks";

const AdminContext = createContext<AdminContextType>({ // Specify the type here
    isLoggedIn: Boolean(sessionStorage.getItem('accessToken')),
    setIsLoggedIn: () => {},

    // showLogin: false,
    // setShowLogin: () => {},

    userLoginSignup: async () => {},
    userLogout: async () => {}, // Update to match the expected type

    foodList: [],

    // cartItems: {},
    // cartHasItems: false,
    // updateCart: async () => {},

    // deliveryFee: 0,
    // cartSubtotal: 0,
    // cartTotal: 0,

    // placeOrder: async () => {},
    // verifyOrder: async () => {},
    getOrders: async () => {},
})

export const useAdmin = () => useContext(AdminContext)






const AdminContextProvider: React.FC<AdminContextProviderProps> = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(sessionStorage.getItem('accessToken')))
    const [showLogin, setShowLogin] = useState<boolean>(false)

    const [foodList, setFoodList] = useState<any>([])

    // useEffect(() => {
    //     console.log(cartItems)
    // }, [cartItems])


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


    // CART SYNC ---
    // useEffect(() => {
    //     if (isLoggedIn) syncCartHook(authCustomFetch, cartItems, setCartItems)
    // }, [isLoggedIn])



// USER ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

    // LOGIN / SIGNUP
    const userLoginSignup = async (data: any, action: LoginAction, setErrors: React.Dispatch<React.SetStateAction<any>>) => {
        console.log("Logging in")

        // Getting data via Hook
        const response = await loginSignupHook(data, action)

        if (response?.data?.success) {
            const {accessToken} = response.data
            updateAuthState({accessToken})
            setShowLogin(false)
            setIsLoggedIn(true)
        }
        else {            
            const type = response?.data?.error?.type || "email"
            const message = response?.data?.error?.message || "Internal Server Error"
            // console.log(type, message)

            // const {type="email", message="Internal Server Error"} = error?.response?.data?.error
            

            setErrors((prevErrors: object) => ({...prevErrors, [type]: message}))
        }
    }

    // LOGOUT
    const userLogout = async () => {
        await logoutHook()
        updateAuthState({accessToken: null})
        navigate("/")
    }


// AUTH STATE ////////////////////////////////////////////////////////////////////////////////////////////////    

    // TOKEN STATE UPDATE - (Access Token in Session Storage)
    const updateAuthState = ({accessToken}: {accessToken: string | null}) => {
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
        // console.log(response)

        // If 403 FORBIDDEN, logout the user
        if (response.status === 403) return false

        const newAccessToken = response?.data?.accessToken || null
        // console.log(newAccessToken)

        // const user = response?.data?.user || null

        // if (newAccessToken && user) updateAuthState({ accessToken: newAccessToken, user })
        if (newAccessToken) updateAuthState({ accessToken: newAccessToken })

        return true
    }
        
    // CUSTOM FETCH CALL FOR AUTHORIZATION REQUIREMENTS
    async function authCustomFetch(url: string, options: CustomFetchOptions) {
        // console.log(options)

        // Inject the Authorization header with the access token
        const accessToken = sessionStorage.getItem('accessToken')
        if (accessToken) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`,
                'x-request-source': 'admin'
            }
        }

        let response
        try {

            response = await axios({ url, ...options }) // First request
            // console.log(response)       

        } catch (error: any) {
            // console.error(error)

            // If unauthorized, try refreshing the token and retrying the request once
            if (error.response.status === 403) {
                console.log("Refreshing Token")
                await generateAccessToken()
                const newAccessToken = sessionStorage.getItem('accessToken')
    
                if (newAccessToken) { // If a new token was given, re-send the request
                    console.log(options)
                    options.headers.Authorization = `Bearer ${newAccessToken}`
                    response = await axios({ url, ...options })
                }
                else { // Otherwise (refresh-token was lost/expired), logout and send user to login/signup
                    userLogout()
                    // window.location.replace("/?login")
                }
            }
            else {
                // console.log("ERROR: " + error.response.statusText)
                return error.response
            }
        }


        // if (!response.ok) {console.error("ERROR WHILE FETCHING: " + response.statusText)}

        // console.log(response)
        return response
    }

// ORDER ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

    // UPDATE ORDER ---
    // const updateOrder = async (orderId: string, orderData: any) => {
    //     const response = await updateOrderHook(orderId, orderData)
    // }

    // GET ORDERS ---`
    const getOrders = async (setOrders: React.Dispatch<React.SetStateAction<any>>) => {
        const response = await getOrdersHook(authCustomFetch, setOrders)
    }


// EXPORT ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const contextValue: AdminContextType = {

        showLogin,
        setShowLogin,

        isLoggedIn,
        setIsLoggedIn,

        userLoginSignup,
        userLogout,

        foodList,

        getOrders,

        // authCustomFetch: (url, options) => authCustomFetch(url, options, generateAccessToken),
        // updateAuthState
    }

    return <AdminContext.Provider value={contextValue}>
        {children}
    </AdminContext.Provider>
}

export default AdminContextProvider