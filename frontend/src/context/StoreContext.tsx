import { createContext, useContext, useEffect, useState } from "react";
import { updateCartHook } from "../hooks/cartHooks";
import { getFoodHook } from "../hooks/foodHooks";
import { loginSignupHook, logoutHook } from "../hooks/userHooks";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { generateAccessTokenHook } from "../hooks/authHooks";
// import { food_list } from "../assets/assets";

const StoreContext = createContext<StoreContextType>({
    isLoggedIn: Boolean(sessionStorage.getItem('accessToken')),
    setIsLoggedIn: () => {},

    accessToken: null,
    setAccessToken: () => {},

    showLogin: false,
    setShowLogin: () => {},

    food_list: [],
    cartItems: {},
    cartHasItems: false,

    deliveryFee: 0,
    cartSubtotal: 0,
    cartTotal: 0,

    addToCart: () => {},
    removeFromCart: () => {},
})

export const useStore = () => useContext(StoreContext)






const StoreContextProvider: React.FC<StoreContextProviderProps> = ({ children }) => {
    const location = useLocation()

    const [showLogin, setShowLogin] = useState<boolean>(false)
    const [cartItems, setCartItems] = useState<any>({})
    // const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'))
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(sessionStorage.getItem('accessToken')))
    const [food_list, setFoodList] = useState<any>([])

    const cartHasItems = Boolean(Object.keys(cartItems).length > 0)
    const deliveryFee = cartHasItems ? 5 : 0


// INITIAL FETCHES ////////////////////////////////////////////////////////////////////////////////////////////////

    // LOGIN / DATA SYNC ---
    useEffect(() => {

        const fetchFoodList = async () => { // Fire if food_list is empty
            if (food_list.length !> 0) await getFoodHook(setFoodList)
        }

        const maintainLoginStatus = async () => {
            
            // Is AccessToken in Session Storage?
            if (sessionStorage.getItem('accessToken')) {
                const success = await generateAccessToken()

                // If failure (403 Response), logout
                if (!success) userLogout()
            }
        }

        fetchFoodList()
        maintainLoginStatus()

    }, [location.pathname])

    // useEffect(() => {
    //     const maintainLoginStatus = async () => {
    //         const response = await generateAccessToken()
    //         if (response !== null) userLogout()
    //     }
  
    //     maintainLoginStatus()
    //     // closeModal()
    // }, [location.pathname])



// USER ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

    // LOGIN / SIGNUP
    const userLoginSignup = async (data: any, action: 'register' | 'login', setErrors) => {

        // Getting data via Hook
        const response = await loginSignupHook(data, action)

        if (response?.data?.success) {
            const {accessToken, user} = response.data
            updateAuthState({accessToken, user})
            setShowLogin(false)
            setIsLoggedIn(true)
        }
        else {            
            const type = response?.data?.error?.type || "email"
            const message = response?.data?.error?.message || "Internal Server Error"
            // console.log(type, message)

            // const {type="email", message="Internal Server Error"} = error?.response?.data?.error
            

            setErrors(prev => ({...prev, [type]: message}))
        }
    }

    // LOGOUT
    const userLogout = async () => {
        await logoutHook()
        updateAuthState({accessToken: null, user: null})
    }


// AUTH STATE ////////////////////////////////////////////////////////////////////////////////////////////////    

    // TOKEN STATE UPDATE - (Access Token in Session Storage)
    const updateAuthState = ({accessToken, user}) => {
        // console.log("Updating information!") // , data

        // If a token is given, save it. Otherwise remove it
        if (accessToken) sessionStorage.setItem('accessToken', accessToken)
        else sessionStorage.removeItem('accessToken')

        // Update the session state
        setIsLoggedIn(Boolean(accessToken))
        console.log("Information Updated!")
    }

    // TOKEN GENERATION (For getting/refreshing the sessions access token)
    const generateAccessToken = async () => {
        console.log("Generating Access Token")

        // Making the request
        const response = await generateAccessTokenHook()

        // If 403 FORBIDDEN, logout the user
        if (response.status === 403) return false

        const newAccessToken = response?.data?.accessToken || null
        const user = response?.data?.user || null

        if (newAccessToken && user) updateAuthState({ accessToken: newAccessToken, user })

        return true
    }
        
    // CUSTOM FETCH CALL FOR AUTHORIZATION REQUIREMENTS
    async function authCustomFetch(url, options = {}) {

        // Inject the Authorization header with the access token
        const accessToken = sessionStorage.getItem('accessToken')
        if (accessToken) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`,
            }
        }

        let response = await axios({ url, ...options }) // First request

        // If unauthorized, try refreshing the token and retrying the request once
        if (response.status === 403) {
            await generateAccessToken()
            const newAccessToken = sessionStorage.getItem('accessToken')

            if (newAccessToken) { // If a new token was given, re-send the request
                options.headers.Authorization = `Bearer ${newAccessToken}`
                response = await axios({ url, ...options })
            }
            else { // Otherwise (refresh-token was lost/expired), logout and send user to login/signup
                userLogout()
                // window.location.replace("/?login")
            }
        }

        // if (!response.ok) {console.error("ERROR WHILE FETCHING: " + response.statusText)}

        // console.log(response)
        return response
    }

// CART ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////    

    // UPDATE ---
    const updateCart = async (itemId: number | string, action: 'add' | 'remove') => {
        if (itemId === undefined || itemId === null) return
        const id = Number(itemId)

        setCartItems((prev: any) => {
            const currentQuantity = prev[id] || 0
            const newQuantity = action === 'add' ? currentQuantity + 1 : currentQuantity - 1

            if (newQuantity <= 0) {
                const { [id]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [id]: newQuantity }
        })

        updateCartHook(itemId, token, action)
    }        

// CHECKOUT ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

    // SUBTOTAL ---
    const getCartSubtotal = () => {
        let subtotal = 0
        for(const item in cartItems) {

            // if (cartItems[item] !> 0) return

            let itemInfo = food_list.find((product: any) => product._id === item)
            subtotal += (itemInfo?.price || 0) * cartItems[item]
        }
        return subtotal
    }

    const cartSubtotal = getCartSubtotal()
    const cartTotal = cartSubtotal + deliveryFee


// EXPORT ////////////////////////////////////////////////////////////////////////////////////////////////

    const contextValue: StoreContextType = {
        // accessToken,
        // setAccessToken,

        showLogin,
        setShowLogin,

        isLoggedIn,
        setIsLoggedIn,

        userLoginSignup,
        userLogout,

        food_list,

        cartItems,
        cartHasItems,
        updateCart,
        // addToCart,
        // removeFromCart,

        deliveryFee,
        cartSubtotal,
        cartTotal,

        authCustomFetch: (url, options) => authCustomFetch(url, options, generateAccessToken),
        // updateAuthState
    }

    return <StoreContext.Provider value={contextValue}>
        {children}
    </StoreContext.Provider>
}

export default StoreContextProvider



// FOOD LIST ---
    // const fetchFoodList = async () => {
    //     try {
    //         const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/food/list')
    //         setFoodList(response.data.foodList || [])
    //     } catch (error) {
    //         console.log("ERROR: Could not fetch food list")
    //     }
    // }

    // LOAD ---
    // const loadCartData = async (token: string) => {
    //     try {
    //         const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/cart/get', {headers: {
    //             'Authorization': `Bearer ${token}`
    //             // token
    //         }})
    //         setCartItems(response.data.cartData)
    //     } catch (error) {
    //         console.error("ERROR: Could not load cart data")
    //     }
    // }

    // // ADD ---
    // const addToCart = async (itemId: number | string) => {
    //     if (itemId === undefined || itemId === null) return

    //     // Local Cart
    //     const id = Number(itemId)
    //     if (!cartItems[id]) {
    //         setCartItems((prev: any) => ({ ...prev, [id]: 1 }))
    //     }
    //     else {
    //         setCartItems((prev: any) => ({ ...prev, [id]: prev[id] + 1 }))
    //     }

    //     // Update Server Cart
    //     updateCartInServer(itemId, token, 'add')
    // }
    
    // // REMOVE ---
    // const removeFromCart = async (itemId: number | string) => {
    //     if (itemId === undefined || itemId === null) return

    //     // Local Cart
    //     const id = Number(itemId)
    //     if (cartItems[id] === 1) {
    //         setCartItems((prev: any) => {
    //             const { [id]: _, ...rest } = prev
    //             return rest
    //         })
    //     } else {
    //         setCartItems((prev: any) => ({ ...prev, [id]: prev[id] - 1 }))
    //     }

    //     // Server Cart
    //     updateCartInServer(itemId, token, 'remove')
    // }