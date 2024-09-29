import { useEffect, useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { placeOrderHook } from '../../hooks/orderHooks'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartSubtotal, deliveryFee, cartTotal, token, food_list, cartItems, cartHasItems } = useStore()
  const [data, setData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Get cart items
    let orderItems: any[] = []
    food_list.map((item: any) => {
      let itemInfo = item
      itemInfo["quantity"] = cartItems[item._id]
      orderItems.push(itemInfo)
    })

    // Create order data
    let orderData = {
      address: data,
      items: orderItems,
      amount: cartTotal + deliveryFee
    }

    // Place order
    placeOrderHook(orderData, token)

    // try {
    //   const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/order/place', orderData, {
    //     headers: {
    //       'Authorization': `Bearer ${token}`
    //       // token
    //     }
    //   })

    //   // If order is not successful, throw an error
    //   if (!response.data.success) throw new Error(response.data.message || "ERROR: Could not place order")

    //   // Else redirect to payment page
    //   window.location.replace(response.data.sessionUrl)

    // } catch (error) {
    //   console.error(error)
    // }
  }

  useEffect(() => {
    if (!token || !cartHasItems) navigate('/cart')
  }, [token, cartHasItems])

  return (
    <form className='checkout' onSubmit={handleSubmit}>
      <div className="checkout-left">

        <p className="title">Delivery Address</p>

        <div className="multi-fields">
          <input required type="text" placeholder='First Name' name='firstName' onChange={handleChange} value={data.firstName} />
          <input required type="text" placeholder='Last Name' name='lastName' onChange={handleChange} value={data.lastName} />
        </div>

        <input required type="text" placeholder='Email Address' name='email' onChange={handleChange} value={data.email} />
        <input required type="text" placeholder='Street Address' name='street_address' onChange={handleChange} value={data.street} />

        <div className="multi-fields">
          <input required type="text" placeholder='City' name='city' onChange={handleChange} value={data.city} />
          <input required type="text" placeholder='State' name='state' onChange={handleChange} value={data.state} />
        </div>

        <div className="multi-fields">
          <input required type="text" placeholder='Zip Code' name='zipcode' onChange={handleChange} value={data.zipcode} />
          <input required type="text" placeholder='Country' name='country' onChange={handleChange} value={data.country} />
        </div>

        <input required type="text" placeholder='Phone Number' name='phone' onChange={handleChange} value={data.phone} />
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

          <button type='submit'>PROCEED TO PAYMENT</button>

        </div>
      </div>

    </form>
  )
}

export default Checkout
