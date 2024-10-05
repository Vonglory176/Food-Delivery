import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import { useAdmin } from '../../context/adminContext'

const Orders = () => {
  const { getOrders } = useAdmin()
  const [orders, setOrders] = useState<any>([])

  useEffect(() => {
    // fetchAllOrders()
    getOrders(setOrders)
  }, [])


  const statusHandler = async (e: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/order/admin-update-status', { orderId, status: e.target.value })
    console.log(response.data)

    if (response.data.success) {
      // await fetchAllOrders()
      getOrders(setOrders)
    }
    else {
      toast.error("Error! Couldn't fetch orders")
    }
  }


  return (
    <div className='orders add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index: number) => {

          const { firstName, lastName, street, city, state, country, zipcode, phone } = order.address

          return (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="" />

              <div>
                <p className="order-item-food">
                  {order.items.map((item, index: number) => {
                    return item.name + " x " + item.quantity + (index === order.items.length - 1 ? ", " : "")
                  })}
                </p>

                <p className="order-item-name">{firstName + " " + lastName}</p>

                <div className="order-item-address">
                  <p>{street + ","}</p>
                  <p>{city + ", " + state + ", " + country + ", " + zipcode}</p>
                </div>

                <p className="order-item-phone">{phone}</p>
              </div>

              <p>Items: {order.items.length}</p>
              <p>Total: ${order.amount}.00</p>
              <select name="" id="" onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                <option value="Food Processing">Pending</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>


            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders
