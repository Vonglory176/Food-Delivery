import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
// import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Cart = () => {

  const { cartItems, food_list, removeFromCart, cartSubtotal, cartTotal, deliveryFee, cartHasItems } = useContext(StoreContext)
  const navigate = useNavigate()

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <br />
        <hr />

        {food_list.map((item, index) => {

          if (cartItems[item._id] > 0) {  // if(cartItems.includes(item._id)){          
            return (
              <div>

                <div className="cart-items-title cart-items-item" key={index}>
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{item.price * cartItems[item._id]}</p>
                  <button className='cross' onClick={() => removeFromCart(Number(item._id))} aria-label='Remove item'>
                    {/* <img src={assets.cross_icon} alt="remove" /> */}
                    X
                  </button>
                </div>
                <hr />

              </div>
            )
          }
        })}

        {!cartHasItems && <p className='cart-empty'>Your cart is empty</p>}

      </div>

      <div className="cart-bottom">

        {/* Cart Totals */}
        <div className="cart-total">

          <h2>Cart Totals</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${cartSubtotal}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>${cartTotal}</b>
            </div>
          </div>

          <button onClick={() => navigate("/checkout")} className={cartHasItems ? "" : "disabled"} disabled={!cartHasItems}>PROCEED TO CHECKOUT</button>

        </div>

        {/* Promo Code */}
        <div className="cart-promocode">

          <div>
            <p>If you have a promo code, Enter it here</p>

            <div className="cart-promocode-input">
              <input type="text" placeholder='Promo Code' />
              <button>Submit</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart
