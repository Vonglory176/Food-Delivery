import { AxiosError } from "axios"

// ORDER HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Get Orders
export const getOrdersHook = async (authCustomFetch: any) => {
    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/order/list', {
            method: 'GET',
        })

        return response

    } catch (error) {
        const axiosError = error as AxiosError
        return axiosError.response
    }
}

// Update Order Status
export const updateOrderStatusHook = async (authCustomFetch: any, orderId: string, status: string) => {
    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/order/admin-update-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: { orderId, status }
        })
        return response

    } catch (error) {
        const axiosError = error as AxiosError
        return axiosError.response
    }
}


