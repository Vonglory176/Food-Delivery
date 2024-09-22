import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null) 

const StoreContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [cartItems, setCartItems] = useState<any>({})

    const addToCart = (itemId: number) => {
        if (!cartItems[itemId]) {
            setCartItems((prev: any) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev: any) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
    }
    
    const removeFromCart = (itemId: number) => {
        if (cartItems[itemId] === 1) {
            setCartItems((prev: any) => {
                const { [itemId]: _, ...rest } = prev
                return rest
            })
        } else {
            setCartItems((prev: any) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        }
    }

    useEffect(() => {
        console.log(cartItems)
    }, [cartItems])
    

    const contextValue = {
        food_list,
        cartItems,
        addToCart,
        removeFromCart
    }

    return <StoreContext.Provider value={contextValue}>
        {children}
    </StoreContext.Provider>
}

export default StoreContextProvider