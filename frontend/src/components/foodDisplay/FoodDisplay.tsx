import React from 'react'
import { useStore } from '../../context/StoreContext'
import FoodItem from '../foodItem/FoodItem'

const FoodDisplay: React.FC<FoodDisplayProps> = ({ category }) => {
    const { foodList } = useStore()

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {foodList.length === 0 ? 
                
                    // If no food items
                    <div className="spinner center"></div> 

                    :

                    // If no items in category
                    foodList.filter((item: any) => category === "All" || item.category === category).length === 0 ? (
                        <p className='center'>No foods found in {category}.</p>
                    )
                    
                    :

                    // If items in category
                    foodList.map((item: any, index: number) => {

                        if (category === "All" || category === item.category) {
                            return <FoodItem key={index} id={item._id} name={item.name} image={item.image} description={item.description} price={item.price} />
                        }

                    })}
            </div>

            <hr />
        </div>
    )
}

export default FoodDisplay
