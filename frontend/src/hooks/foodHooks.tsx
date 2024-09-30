import axios from "axios"

// FOOD HOOKS ////////////////////////////////////////////////////////////////////////////////////////////////

// Get Food Items (Server)
export const getFoodHook = async (setFoodItems: React.Dispatch<React.SetStateAction<any>>) => {
    try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/food/list')

        setFoodItems(response.data.foodItems || [])
        
    } catch (error) {
        console.error("ERROR: Could not get food items")
    }
}