import React, { useContext } from 'react'
import { StoreContext, useStore } from '../../context/StoreContext'
import FoodItem from '../foodItem/FoodItem'

const FoodDisplay: React.FC<FoodDisplayProps> = ({ category }) => {
    const { food_list } = useStore()

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {food_list.map((item: any, index: number) => {

                    if (category === "All" || category === item.category) {
                        return <FoodItem key={index} id={item._id} name={item.name} image={item.image} description={item.description} price={item.price} />
                    }
                    
                })}
            </div>
        </div>
    )
}

export default FoodDisplay
