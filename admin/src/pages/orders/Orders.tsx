import { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAdmin } from '../../context/adminContext'
import Spinner from '../../components/spinner/Spinner'

const Orders = () => {
  const { getOrders, updateOrderStatus, isLoading } = useAdmin()
  const [orders, setOrders] = useState<any>([])

  useEffect(() => {
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

          orders && orders.map((order, index: number) => {

            const { firstName, lastName, street, city, state, country, zipcode, phone } = order.address

            return (
              <div key={index} className={`order-item ${order.status === "Delivered" ? "delivered" : ""}`}>
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
                <select name="" id="" onChange={(e) => updateOrderStatus(e, order._id, setOrders)} value={order.status}>
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
