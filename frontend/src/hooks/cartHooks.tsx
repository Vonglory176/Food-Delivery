

// CART HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Sync Cart (On login / checkout)
export const syncCartHook = async (authCustomFetch, cartItems={}, setCartItems: React.Dispatch<React.SetStateAction<any>>) => { // , setCartLoading = () => {}
    // console.log(cartItems)

    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/cart/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                cartData: cartItems // Determinded by login state
            }
        })

        setCartItems(response.data.cartData || {})
        // setCartLoading(false)

    } catch (error) {
        // console.log(error)
        console.error("ERROR: Could not load cart data")
        setCartItems({})
    }
}

// Update Cart (Server)
export const updateCartHook = async (authCustomFetch, itemId: string, action: 'add' | 'remove') => {
    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/cart/' + action + '/' + itemId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.data.success) throw new Error

    } catch (error) {
        console.error("ERROR: Could not update cart in server")
    }
}