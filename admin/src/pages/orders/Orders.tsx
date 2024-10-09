import { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAdmin } from '../../context/adminContext'
import Spinner from '../../components/spinner/Spinner'

const Orders = () => {
  const { getOrders, updateOrderStatus, isLoading, setIsLoading } = useAdmin()
  const [orders, setOrders] = useState<any>([])

  useEffect(() => {
    setIsLoading(true)
    getOrders(setOrders)
  }, [])


  // const statusHandler = async (e: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
  //   const status = e.target.value
  //   updateOrderStatus(orderId, status, setOrders)
  // }


  return (
    <div className='orders page'>
      <h3>Order List</h3>
      <div className="order-list">

        {isLoading ? <Spinner />

          :

          orders && orders.map((order: any, index: number) => {

            const { firstName, lastName, street, city, state, country, zipcode, phone } = order.address

            return (
              <div key={index} className={`order-item ${order.status === "Delivered" ? "delivered" : order.status === "Out For Delivery" ? "delivering" : ""}`}>

                {/* Timestamp */}
                <div className="order-item-header">
                  {/* Food Items */}
                  <p className="order-item-food">
                    {order.items.map((item: any, index: number) => {
                      return <span key={index}>{item.name} <span style={{ fontWeight: "normal" }}>x {item.quantity}</span> {index === order.items.length - 1 ? "" : ", "}</span>
                    })}
                  </p>
                  <img src={assets.parcel_icon} alt="" />
                </div>

                <hr />

                <div className="order-item-content">

                  {/* Time */}
                  <div className="order-item-time">
                    <p><b>Time:</b> {new Date(order.date).toLocaleString()}</p>
                  </div>


                  {/* Quanity / Cost */}
                  <p><b>Items:</b> {order.items.length}</p>

                  {/* Status */}
                  <select name="status" onChange={(e) => updateOrderStatus(e.target.value, order._id, setOrders)} value={order.status}>
                    <option value="Food Processing">Pending</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>


                  {/* Delivery Address */}
                  <div className='order-item-info'>
                    <p className="order-item-name">{firstName + " " + lastName}</p>

                    <div className="order-item-address">
                      <p>{street + ","}</p>
                      <p>{city + ", " + state + ", " + country + ", " + zipcode}</p>
                    </div>

                    <p className="order-item-phone">{phone}</p>
                  </div>     

                  <p><b>Total:</b> ${order.amount}.00</p>


                </div>



              </div>
            )
          })}
      </div>
    </div>
  )
}

export default Orders
