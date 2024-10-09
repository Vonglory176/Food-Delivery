import { createContext, useContext, useEffect, useState } from "react";
import { syncCartHook, updateCartHook } from "../hooks/cartHooks";
import { getFoodHook } from "../hooks/foodHooks";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { generateAccessTokenHook, loginSignupHook, logoutHook } from "../hooks/authHooks";
import { getOrdersHook, placeOrderHook, verifyPaymentHook } from "../hooks/orderHooks";
// import { foodList } from "../assets/assets";

const StoreContext = createContext<StoreContextType>({ // Specify the type here
    isLoggedIn: Boolean(sessionStorage.getItem('accessToken')),
    setIsLoggedIn: () => {},

    showLogin: false,
    setShowLogin: () => {},

    userLoginSignup: async () => {},
    userLogout: async () => {}, // Update to match the expected type

    foodList: [],

    cartIsLoaded: false,

    cartItems: {},
    cartHasItems: false,
    updateCart: async () => {},

    deliveryFee: 0,
    cartSubtotal: 0,
    cartTotal: 0,

    placeOrder: async () => {},
    verifyOrder: async () => {},
    getOrders: async () => {},
})

export const useStore = () => useContext(StoreContext)






const StoreContextProvider: React.FC<StoreContextProviderProps> = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(sessionStorage.getItem('accessToken')))
    const [showLogin, setShowLogin] = useState<boolean>(false)

    const [cartItems, setCartItems] = useState<any>({})
    const [cartIsLoaded, setCartIsLoaded] = useState<boolean>(Boolean(!isLoggedIn)) // For cart sync


    const [foodList, setFoodList] = useState<any>([])

    const cartHasItems = Boolean(Object.keys(cartItems).length > 0)
    const deliveryFee = cartHasItems ? 5 : 0

    // useEffect(() => {
    //     console.log(cartItems)
    // }, [cartItems])


// INITIAL FETCHES ////////////////////////////////////////////////////////////////////////////////////////////////

    // LOGIN / FOOD SYNC ---
    useEffect(() => {

        const fetchFoodList = async () => {
                console.log("Fetching Food List")
                await getFoodHook(setFoodList)
        }

        const maintainLoginStatus = async () => {
            
            // Is AccessToken in Session Storage?
            if (sessionStorage.getItem('accessToken')) {
                const success = await generateAccessToken()

                // If failure (403 Response), logout
                if (!success) userLogout()
            }
        }

        if (foodList.length === 0) fetchFoodList() // Fire if foodList is empty
        maintainLoginStatus()

    }, [location.pathname])


    // CART SYNC ---
    useEffect(() => {
        const syncCart = async () => {
            if (isLoggedIn) {
                setCartIsLoaded(false)
                await syncCartHook(authCustomFetch, cartItems, setCartItems)
            }
            setCartIsLoaded(true)
        }

        syncCart()
    }, [isLoggedIn])



// USER ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

    // LOGIN / SIGNUP
    const userLoginSignup = async (data: any, action: LoginAction, setErrors: React.Dispatch<React.SetStateAction<any>>) => {

        // Getting data via Hook
        const response = await loginSignupHook(data, action)

        if (response?.data?.success) {
            const {accessToken} = response.data
            updateAuthState({accessToken})
            setShowLogin(false)
            setIsLoggedIn(true)

            // Sync Cart
            // syncCartHook(authCustomFetch, cartItems, setCartItems)
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
        setCartItems({})
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
                Authorization: `Bearer ${accessToken}`,
            }
        }

        let response
        try {

            // PRIMARY REQUEST ---
            response = await axios({ url, ...options })
            // console.log(response)      

        } catch (error: any) {

            // TOKEN REFRESH REQUEST --- (If unauthorized, try refreshing the token and retrying the request once)
            if (error.response.status === 403) {

                const success = await generateAccessToken()
                const newAccessToken = sessionStorage.getItem('accessToken')

                // RE-TRY REQUEST --- (If a new token was given, re-send the request)
                if (success && newAccessToken) {
                    options.headers.Authorization = `Bearer ${newAccessToken}`
                    response = await axios({ url, ...options })
                    // console.log(response)
                }
                else {
                    // RE-TRY FAILED --- (Refresh-token was lost/expired, logout user)
                    userLogout()
                    // window.location.replace("/?login")
                }
            }
            // Non-403 Error
            else return error.response
        }

        return response
    }

// CART ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////    

    // UPDATE ---
    const updateCart = async (itemId: string | number, action: CartAction) => {
        if (!itemId) return
        // const id = Number(itemId)

        // Quantity limits
        if (action === 'add' && cartItems[itemId] >= 99) return
        if (action === 'remove' && cartItems[itemId] <= 0) return

        // Update cart items
        setCartItems((prev: QuantityMap) => {
            // console.log(prev)
            const currentQuantity = prev[itemId] || 0
            const newQuantity = action === 'add' ? currentQuantity + 1 : currentQuantity - 1

            if (newQuantity <= 0) {
                const { [itemId]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [itemId]: newQuantity }
        })

        if (isLoggedIn) updateCartHook(authCustomFetch, itemId.toString(), action)
    }        

// CHECKOUT ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

    // SUBTOTAL ---
    const getCartSubtotal = () => {
        let subtotal = 0
        for(const item in cartItems) {

            // if (cartItems[item] !> 0) return

            let itemInfo = foodList.find((product: any) => product._id === item)
            subtotal += (itemInfo?.price || 0) * cartItems[item]
        }
        return subtotal
    }

    const cartSubtotal = getCartSubtotal()
    const cartTotal = cartSubtotal + deliveryFee

// ORDER ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

    // PLACE ORDER ---
    const placeOrder = async (orderData: any) => {

        placeOrderHook(authCustomFetch, orderData)

    }

    // VERIFY ORDER ---
    const verifyOrder = async (success: boolean, orderId: string = '') => {

        verifyPaymentHook(authCustomFetch, success, orderId, navigate)        
    }

    // GET ORDERS ---
    const getOrders = async (setOrders: any) => {

        getOrdersHook(authCustomFetch, setOrders)
    }


// EXPORT ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const contextValue: StoreContextType = {

        showLogin,
        setShowLogin,

        isLoggedIn,
        setIsLoggedIn,

        userLoginSignup,
        userLogout,

        foodList,

        cartIsLoaded,
        // setCartIsLoaded,

        cartItems,
        cartHasItems,
        updateCart,

        placeOrder,
        verifyOrder,
        getOrders,

        deliveryFee,
        cartSubtotal,
        cartTotal,

        // authCustomFetch: (url, options) => authCustomFetch(url, options, generateAccessToken),
        // updateAuthState
    }

    return <StoreContext.Provider value={contextValue}>
        {children}
    </StoreContext.Provider>
}

export default StoreContextProvider