declare global {

    // Assets //////////////////////////////

    interface AssetsType {
        logo: string;
        basket_icon: string;
        header_img: string;
        search_icon: string;
        rating_starts: string;
        add_icon_green: string;
        add_icon_white: string;
        remove_icon_red: string;
        app_store: string;
        play_store: string;
        linkedin_icon: string;
        facebook_icon: string;
        twitter_icon: string;
        cross_icon: string;
        selector_icon: string;
        profile_icon: string;
        logout_icon: string;
        bag_icon: string;
        parcel_icon: string;
    }

    interface MenuType {
        menu_name: string;
        menu_image: string;
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

    interface ExploreMenuProps {
        category: string
        setCategory: React.Dispatch<React.SetStateAction<string>>
    }

    interface FoodDisplayProps {
        category: string
    }

    interface FoodItemProps {
        id: number
        name: string
        image: string
        description: string
        price: number
    }

    interface LoginPopupProps {
        setShowLogin: React.Dispatch<React.SetStateAction<boolean>>
    }

    interface NavbarProps {
        setShowLogin: React.Dispatch<React.SetStateAction<boolean>>
    }

    // Context //////////////////////////////

    interface StoreContextType {
        food_list: FoodType[]
        cartItems: any
        cartHasItems: boolean
        deliveryFee: number
        cartSubtotal: number
        cartTotal: number
        addToCart: (itemId: number) => void
        removeFromCart: (itemId: number) => void
    }

    interface StoreContextProviderProps {
        children: React.ReactNode
    }
}