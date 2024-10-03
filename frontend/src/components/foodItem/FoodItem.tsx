import React from 'react'
import { assets } from '../../assets/assets'
import { useStore } from '../../context/StoreContext'

const FoodItem: React.FC<FoodItemProps> = ({id, name, image, description, price}) => {
    const { cartItems, updateCart } = useStore()
  
    return (
    <div className='food-item'>

      <div className="food-item-img-container">
        <img className='food-item-image' src={import.meta.env.VITE_BACKEND_URL + '/images/' + image} alt={name} />


        {/* Item counter & Add/Remove from cart buttons */}        
        <div className={`food-item-counter ${cartItems[id] ? 'active' : ''}`}>

            {cartItems[id] && <>
                {/* Remove from cart button */}
                <button className='remove-from-cart-btn' onClick={() => updateCart(id, 'remove')} aria-label='Remove from cart'>
                    <img className='remove' src={assets.remove_icon_red} alt="Minus icon" />
                </button>

                {/* Item count */}
                <p>{cartItems[id]}</p>
            </>}

            {/* Add to cart button */}
            <button className='add-to-cart-btn' onClick={() => updateCart(id, 'add')} aria-label='Add to cart'>
                <img className='add' src={!cartItems[id] ? assets.add_icon_white : assets.add_icon_green} alt="Add icon" />
            </button>
        </div>
      </div>

      <div className="food-item-info">

        <div className="food-item-name-rating">
            <p>{name}</p>
            <img src={assets.rating_starts} alt="rating" />
        </div>

        <p className='food-item-desc'>{description}</p>
        <p className='food-item-price'>${price}</p>
      </div>
    </div>
  )
}

export default FoodItem
