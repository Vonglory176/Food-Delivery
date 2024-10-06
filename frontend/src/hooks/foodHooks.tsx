import axios from "axios"

// FOOD HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Get Food Items (Server)
export const getFoodHook = async (setFoodItems: React.Dispatch<React.SetStateAction<any>>) => {
    try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/food/list')
        // console.log(response)

        setFoodItems(response?.data?.foodList || [])
        
    } catch (error) {
        setFoodItems([])
        // console.log(error)
        console.error("ERROR: Could not get food items")
    }
}