import { useEffect, useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartSubtotal, deliveryFee, cartTotal, foodList, cartItems, cartHasItems, isLoggedIn, placeOrder } = useStore()
  const [data, setData] = useState<any>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'JohnDoe@gmail.com',
    street: '1234 Main St',
    city: 'Anytown',
    state: 'CA',
    zipcode: '12345',
    country: 'USA',
    phone: '1234567890',
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Get cart items
    let orderItems: any[] = []
    foodList.map((item: any) => {
      let itemInfo = item

      if (cartItems[item._id] > 0) {
        itemInfo["quantity"] = cartItems[item._id]
        orderItems.push(itemInfo)
      }
    })

    // Create order data
    let orderData = {
      address: data,
      items: orderItems, // orderItems
      amount: cartTotal + deliveryFee
    }

    // Place order
    placeOrder(orderData)

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
    if (!isLoggedIn || !cartHasItems) navigate('/cart')
  }, [isLoggedIn, cartHasItems])

  return (
    <form className='checkout' onSubmit={handleSubmit}>
      <div className="checkout-left">

        <p className="title">Delivery Address</p>

        <div className="multi-fields">
          <input required type="text" placeholder='First Name' name='firstName' maxLength={50} onChange={handleChange} value={data.firstName} />
          <input required type="text" placeholder='Last Name' name='lastName' maxLength={50} onChange={handleChange} value={data.lastName} />
        </div>

        <input required type="text" placeholder='Email Address' name='email' maxLength={50} onChange={handleChange} value={data.email} />
        <input required type="text" placeholder='Street Address' name='street' maxLength={50} onChange={handleChange} value={data.street} />

        <div className="multi-fields">
          <input required type="text" placeholder='City' name='city' maxLength={50} onChange={handleChange} value={data.city} />
          <input required type="text" placeholder='State' name='state' maxLength={50} onChange={handleChange} value={data.state} />
        </div>

        <div className="multi-fields">
          <input required type="text" placeholder='Zip Code' name='zipcode' maxLength={10} onChange={handleChange} value={data.zipcode} />
          <input required type="text" placeholder='Country' name='country' maxLength={50} onChange={handleChange} value={data.country} />
        </div>

        <input required type="text" placeholder='Phone Number' name='phone' maxLength={20} onChange={handleChange} value={data.phone} />
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
