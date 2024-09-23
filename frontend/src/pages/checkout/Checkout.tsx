import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'

const Checkout = () => {
  const { cartSubtotal, deliveryFee, cartTotal } = useContext(StoreContext)

  return (
    <form className='checkout'>
      <div className="checkout-left">

        <p className="title">Delivery Address</p>

        <div className="multi-fields">
          <input type="text" placeholder='First Name' />
          <input type="text" placeholder='Last Name' />
        </div>

        <input type="text" placeholder='Email Address' />
        <input type="text" placeholder='Street Address' />

        <div className="multi-fields">
          <input type="text" placeholder='City' />
          <input type="text" placeholder='State' />
        </div>

        <div className="multi-fields">
          <input type="text" placeholder='Zip Code' />
          <input type="text" placeholder='Country' />
        </div>

        <input type="text" placeholder='Phone Number' />
      </div>

      <div className="checkout-right">
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
              <b>${cartTotal + deliveryFee}</b>
            </div>
          </div>

          <button>PROCEED TO PAYMENT</button>

        </div>
      </div>

    </form>
  )
}

export default Checkout
