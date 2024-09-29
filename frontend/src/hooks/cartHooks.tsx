import axios from "axios"

// CART HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Get Cart (Server)
export const loadCartHook = async (token: string, setCartItems: React.Dispatch<React.SetStateAction<any>>) => {
    try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/cart/get', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        setCartItems(response.data.cartData)

    } catch (error) {
        console.error("ERROR: Could not load cart data")
    }
}

// Update Cart (Server)
export const updateCartHook = async (itemId: number | string, token: string, action: 'add' | 'remove') => {
    try {
        const response = await axios.patch(import.meta.env.VITE_BACKEND_URL + '/api/cart/' + action, { itemId }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.data.success) throw new Error
    } catch (error) {
        console.error("ERROR: Could not update cart in server")
    }
}