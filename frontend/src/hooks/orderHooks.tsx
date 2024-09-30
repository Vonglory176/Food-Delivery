import axios from "axios"

// ORDER HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Place Order
export const placeOrderHook = async (authCustomFetch, orderData: any) => {
    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/order/place', orderData, {
            headers: {
                'Method': 'POST',
                // 'Authorization': `Bearer ${token}`
            }
        })

        // If order is not successful, throw an error
        if (!response.data.success) throw new Error(response.data.message || "ERROR: Could not place order")

        // Else redirect to payment page
        window.location.replace(response.data.sessionUrl)

    } catch (error) {
        console.error(error)
    }
}

// Get Orders
export const getOrdersHook = async (authCustomFetch, setData: React.Dispatch<React.SetStateAction<any>>) => {
    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/order/user-list', {}, {
            headers: {
                'Method': 'GET',
                // 'Authorization': `Bearer ${token}`
            }
        })

        setData(response.data.data)

    } catch (error) {
        console.log(error)
    }
}

// Verify Order
export const verifyPayment = async (success: boolean, orderId: string, navigate: any) => {
    try {
        const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/order/verify', { success, orderId })

        if (response.data.success) {
            navigate('/myorders')
        }
        else {
            navigate('/')
        }

    } catch (error) {
        console.log(error)
    }
}
