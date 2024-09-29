import { createContext, useContext, useEffect, useState } from "react";
import { loadCartHook, updateCartHook } from "../hooks/cartHooks";
import { getFoodHook } from "../hooks/foodHooks";
import { logoutHook } from "../hooks/userHooks";
import axios from "axios";
// import { food_list } from "../assets/assets";

const StoreContext = createContext<StoreContextType>({
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

    const [showLogin, setShowLogin] = useState<boolean>(false)
    const [cartItems, setCartItems] = useState<any>({})
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'))
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [food_list, setFoodList] = useState<any>([])

    const cartHasItems = Boolean(Object.keys(cartItems).length > 0)
    const deliveryFee = cartHasItems ? 5 : 0


// INITIAL FETCHES ////////////////////////////////////////////////////////////////////////////////////////////////

    // LOGIN / DATA SYNC ---
    useEffect(() => {
        const loadData = async () => {
            await getFoodHook(setFoodList)
            // const token = localStorage.getItem('token')
            // if(token) {
            //     setToken(token)

            //     await loadCartHook(token, setCartItems)
            // }
        }
        loadData()
    }, [])

    // Maintains login status between pages
    useEffect(() => {
        const maintainLoginStatus = async () => {
            const response = await generateAccessToken()
            if (response !== null) logoutHook(updateAuthState)
        }
  
        maintainLoginStatus()
        // closeModal()
      }, [location.pathname])

// CART ACTIONS ////////////////////////////////////////////////////////////////////////////////////////////////    

    // TOKEN STATE REFRESH (For SETTING the sessions access token)
    const updateAuthState = (data) => {
        // console.log("Updating information!") // , data

        // If a token is given, save it. Otherwise remove it
        if (data.accessToken) sessionStorage.setItem('accessToken', data.accessToken)
        else sessionStorage.removeItem('accessToken')

        // Update the session state
        setAccessToken(data.accessToken)
        setIsLoggedIn(data.accessToken? true : false)
    }

    // TOKEN GENERATION (For getting/refreshing the sessions access token)
    const generateAccessToken = async () => {

        try {
            // Making the request
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/generate_access_token`)

            // Updating the auth state
            if (response.data.success) {
                const {accessToken, user} = response.data   
                updateAuthState({
                    accessToken,
                    user
                })
        
                return null
            }
        
        } catch (error) { 
            console.log(error)
        }
        
        return false
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
                logoutHook(updateAuthState)
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
        accessToken,
        // setAccessToken,

        showLogin,
        setShowLogin,

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