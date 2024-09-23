import { createContext, useState } from "react";
import { food_list } from "../assets/assets";

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

    const cartHasItems = Boolean(Object.keys(cartItems).length > 0)
    const deliveryFee = cartHasItems ? 5 : 0

    const addToCart = (itemId: number | string) => {
        if (itemId === undefined || itemId === null) return

        const id = Number(itemId)
        if (!cartItems[id]) {
            setCartItems((prev: any) => ({ ...prev, [id]: 1 }))
        }
        else {
            setCartItems((prev: any) => ({ ...prev, [id]: prev[id] + 1 }))
        }
    }
    
    const removeFromCart = (itemId: number | string) => {
        if (itemId === undefined || itemId === null) return

        const id = Number(itemId)
        if (cartItems[id] === 1) {
            setCartItems((prev: any) => {
                const { [id]: _, ...rest } = prev
                return rest
            })
        } else {
            setCartItems((prev: any) => ({ ...prev, [id]: prev[id] - 1 }))
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

    // useEffect(() => {
    //     console.log(cartItems)
    //     console.log(cartItems.length)
    // }, [cartItems])    

    const contextValue: StoreContextType = {
        food_list,
        cartItems,
        cartHasItems,
        deliveryFee,
        cartSubtotal,
        cartTotal,
        addToCart,
        removeFromCart,
        // getTotalCartAmount
    }

    return <StoreContext.Provider value={contextValue}>
        {children}
    </StoreContext.Provider>
}

export default StoreContextProvider