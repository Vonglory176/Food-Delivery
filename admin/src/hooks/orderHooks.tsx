// import axios from "axios"

import { toast } from "react-toastify"

// ORDER HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Get Orders
export const getOrdersHook = async (authCustomFetch: any, setData: React.Dispatch<React.SetStateAction<any>>) => {
    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/order/list', {
            method: 'GET',
            // headers: {
            //     'x-request-source': 'admin'
            // }
        })

        setData(response.data.data)

    } catch (error) {
        console.log(error)
        toast.error("Error! Couldn't fetch orders")
    }
}
