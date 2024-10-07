import Spinner from '../../components/spinner/Spinner'
import { useStore } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {

  const { isLoggedIn, cartItems, foodList, updateCart, cartSubtotal, cartTotal, deliveryFee, cartHasItems, setShowLogin, cartIsLoaded } = useStore()
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

        {
          !cartIsLoaded ? <Spinner />

            :

            !cartHasItems ? <div className="cart-items-wrapper"><p className='cart-empty'>Your cart is empty</p></div>

              :

              foodList.map((item, index) => {

                if (cartItems[item._id] > 0) {  // if(cartItems.includes(item._id)){          
                  return (
                    <div key={index}>

                      <div className="cart-items-title cart-items-item">
                        <img src={import.meta.env.VITE_BACKEND_URL + '/images/' + item.image} alt={item.name} />
                        <p>{item.name}</p>
                        <p>${item.price}</p>
                        <p>{cartItems[item._id]}</p>
                        <p>${item.price * cartItems[item._id]}</p>
                        <button className='cross' onClick={() => updateCart(item._id, 'remove')} aria-label='Remove item'>
                          {/* <img src={assets.cross_icon} alt="remove" /> */}
                          X
                        </button>
                      </div>
                      <hr />

                    </div>
                  )
                }
              })}

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

          <button onClick={() => isLoggedIn ? navigate("/checkout") : setShowLogin(true)} className={cartHasItems ? "" : "disabled"} disabled={cartHasItems ? false : true} aria-label='Proceed to checkout'>PROCEED TO CHECKOUT</button>

        </div>

        {/* Promo Code */}
        <div className="cart-promocode">

          <div>
            <p>If you have a promo code, Enter it here</p>

            <div className="cart-promocode-input">
              <input type="text" placeholder='Promo Code' maxLength={30} />
              <button aria-label='Submit promo code'>Submit</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart
