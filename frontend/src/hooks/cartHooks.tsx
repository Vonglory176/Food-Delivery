

// CART HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Sync Cart (On login / checkout)
export const syncCartHook = async (authCustomFetch, cartItems={}, setCartItems: React.Dispatch<React.SetStateAction<any>>, setCartLoading) => {
    console.log(cartItems)

    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/cart/sync', {
            method: 'POST',
            headers: {
                // 'Method': 'GET',
                // 'Authorization': `Bearer ${token}`
                'Content-Type': 'application/json',
            },
            data: { // Change made here
                cartData: cartItems === cartItems // Determinded by login state
            }
        })

        setCartItems(response.data.cartData)
        setCartLoading(false)

    } catch (error) {
        console.error("ERROR: Could not load cart data")
    }
}

// Update Cart (Server)
export const updateCartHook = async (authCustomFetch, itemId: string, action: 'add' | 'remove') => {
    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/cart/' + action + '/' + itemId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            },
            // body: {
            //     itemId
            // }
        })

        if (!response.data.success) throw new Error

    } catch (error) {
        console.error("ERROR: Could not update cart in server")
    }
}