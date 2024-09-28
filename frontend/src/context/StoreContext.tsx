import axios from "axios";
import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";

export const StoreContext = createContext<StoreContextType>({
    food_list: [],
    cartItems: {},
    cartHasItems: false,
    deliveryFee: 0,
    cartSubtotal: 0,
    cartTotal: 0,
    addToCart: () => {},
    removeFromCart: () => {},
})
// export const StoreContext = createContext({}) 

const StoreContextProvider: React.FC<StoreContextProviderProps> = ({ children }) => {

    const [cartItems, setCartItems] = useState<any>({})
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [food_list, setFoodList] = useState<any>([])

    const cartHasItems = Boolean(Object.keys(cartItems).length > 0)
    const deliveryFee = cartHasItems ? 5 : 0

    const addToCart = async (itemId: number | string) => {
        if (itemId === undefined || itemId === null) return

        // Local Cart
        const id = Number(itemId)
        if (!cartItems[id]) {
            setCartItems((prev: any) => ({ ...prev, [id]: 1 }))
        }
        else {
            setCartItems((prev: any) => ({ ...prev, [id]: prev[id] + 1 }))
        }

        // Server Cart
        try {
            if (token) {
                const response = await axios.post(import.meta.env.VITE_FRONTEND_URL + '/api/cart/add', {itemId},{headers: {
                    // 'Authorization': `Bearer ${token}`
                    token
                }})

                if (!response.data.success) throw new Error
            }            
        } catch (error) {
            console.error("ERROR: Could not update cart in server")
        }
    }
    
    const removeFromCart = async (itemId: number | string) => {
        if (itemId === undefined || itemId === null) return

        // Local Cart
        const id = Number(itemId)
        if (cartItems[id] === 1) {
            setCartItems((prev: any) => {
                const { [id]: _, ...rest } = prev
                return rest
            })
        } else {
            setCartItems((prev: any) => ({ ...prev, [id]: prev[id] - 1 }))
        }

        // Server Cart
        try {
            if (token) {
                const response = await axios.post(import.meta.env.VITE_FRONTEND_URL + '/api/cart/remove', {itemId},{headers: {
                    // 'Authorization': `Bearer ${token}`
                    token
                }})

                if (!response.data.success) throw new Error
            }            
        } catch (error) {
            console.error("ERROR: Could not update cart in server")
        }
    }

    const loadCartData = async (token: string) => {
        try {
            const response = await axios.get(import.meta.env.VITE_FRONTEND_URL + '/api/cart/get', {headers: {
                // 'Authorization': `Bearer ${token}`
                token
            }})
            setCartItems(response.data.cartData)
        } catch (error) {
            console.error("ERROR: Could not load cart data")
        }
    }

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

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_FRONTEND_URL + '/api/food/list')
            setFoodList(response.data.foodList || [])
        } catch (error) {
            console.log("ERROR: Could not fetch food list")
        }
    }

    // Load data from server
    useEffect(() => {
        const loadData = async () => {
            await fetchFoodList()
            const token = localStorage.getItem('token')
            if(token) {
                setToken(token)
                await loadCartData(token)
            }
        }
        loadData()
    }, [])

    const contextValue: StoreContextType = {
        food_list,
        cartItems,
        cartHasItems,
        deliveryFee,
        cartSubtotal,
        cartTotal,
        token,
        setToken,
        addToCart,
        removeFromCart,
        
        
        // getTotalCartAmount
    }

    return <StoreContext.Provider value={contextValue}>
        {children}
    </StoreContext.Provider>
}

export default StoreContextProvider