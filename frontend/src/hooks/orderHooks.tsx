// import axios from "axios"

// ORDER HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Place Order
export const placeOrderHook = async (authCustomFetch: any, orderData: object) => {
    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/order/place', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            },
            data: {
                orderData
            }
        })
        console.log(response)

        // If order is not successful, throw an error
        if (!response.data.success) throw new Error(response.data.message || "ERROR: Could not place order")

        // Else redirect to payment page
        window.location.replace(response.data.sessionUrl)

    } catch (error) {
        console.error(error)
    }
}

// Get Orders
export const getOrdersHook = async (authCustomFetch: any, setData: React.Dispatch<React.SetStateAction<any>>) => {
    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/order/list', {
            method: 'GET',
            // headers: {
            //     'Authorization': `Bearer ${token}`
            // }
        })

        setData(response.data.data)

    } catch (error) {
        console.log(error)
    }
}

// Verify Order
export const verifyPaymentHook = async (authCustomFetch: any, success: boolean, orderId: string, navigate: any) => {
    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/order/verify', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            },
            data: { success, orderId }
        })

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
