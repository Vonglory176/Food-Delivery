declare global {

    // Assets //////////////////////////////

    interface AssetsType {
        logo: string
        add_icon: string
        order_icon: string
        profile_image: string
        upload_area: string
        parcel_icon: string
        cross_icon: string
        logout_icon: string
    }

    interface FoodType {
        _id: string;
        name: string;
        image: string;
        price: number;
        description: string;
        category: string;
    }

    // Components //////////////////////////////

    // Context //////////////////////////////

    interface AdminContextType {
        showLogin: boolean
        setShowLogin: React.Dispatch<React.SetStateAction<boolean>>

        isLoading: boolean
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>

        isLoggedIn: boolean
        setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>

        isDemoMode: boolean

        userLoginSignup: (data: any, action: LoginAction, setErrors: React.Dispatch<React.SetStateAction<any>>) => Promise<void>
        userLogout: () => {}

        foodList: FoodType[]

        getFood: () => Promise<void>
        addFood: (formData: FormData, resetForm: () => void) => Promise<void>
        removeFood: (foodId: string) => Promise<void>

        getOrders: (setOrders: any) => Promise<void>
        updateOrderStatus: (status: string, orderId: string, setOrders: any) => Promise<void>
    }

    interface AdminContextProviderProps {
        children: React.ReactNode
    }

    // Actions //////////////////////////////

    type CartAction = 'add' | 'remove'
    type LoginAction = 'register' | 'login'

    // Other //////////////////////////////

    interface QuantityMap {
        [key: string]: number // Define an index signature for string keys
    }

    interface CustomFetchOptions {
        method: string
        headers: {
            [key: string]: string
        }
        data?: string
    }
}