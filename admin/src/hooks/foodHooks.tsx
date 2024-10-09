import axios, { AxiosError } from "axios"

// FOOD HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Get Food Items
export const getFoodHook = async () => {
    try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/food/list')
        // console.log(response)

        return response
        
    } catch (error) {
        // console.error("ERROR: Could not get food items")

        const axiosError = error as AxiosError
        return axiosError.response
    }
}

// Add Food Item
export const addFoodHook = async (authCustomFetch: any, formData: FormData) => {
    console.log(formData)
    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/food/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
        return response

    } catch (error) {
        // console.error("ERROR: Could not add food item")

        const axiosError = error as AxiosError
        return axiosError.response

    }
}

//  Remove Food Item
export const removeFoodHook = async (authCustomFetch: any, foodId: string) => {
    try {
        const response = await authCustomFetch(import.meta.env.VITE_BACKEND_URL + '/api/food/remove/' + foodId, {
            method: 'DELETE'
        })
        return response

    } catch (error) {
        // console.error("ERROR: Could not remove food item")

        const axiosError = error as AxiosError
        return axiosError.response
    }
}

