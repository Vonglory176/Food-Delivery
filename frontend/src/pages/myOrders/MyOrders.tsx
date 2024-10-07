import { useEffect, useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { assets } from '../../assets/assets'
import Spinner from '../../components/spinner/Spinner'

const MyOrders = () => {

    const { isLoggedIn, getOrders } = useStore()
    const [orders, setOrders] = useState<any>(false)


    // Fetch orders
    useEffect(() => {
        if (isLoggedIn) getOrders(setOrders)
    }, [])


    return (
        <div className='my-orders'>
            <h2>My Orders</h2>

            <div className="container">
                {orders === false ?

                    // Loading Spinner
                    // <div className="spinner-wrapper"><div className="spinner"></div></div>
                    <Spinner />

                    :

                    // No orders
                    orders.length === 0 ? <p className='no-orders'>You have no orders</p>

                        :

                        // Orders
                        orders.map((order: { items: any, amount: number, status: string }, index: number) => (
                            <div key={index} className={`my-orders-order ${order.status === "Delivered" ? "delivered" : order.status === "Out For Delivery" ? "delivering" : ""}`}>


                                <div className="my-orders-order-header">
                                    <img src={assets.parcel_icon} alt="" />

                                    {/* Food Items */}
                                    <p style={{ fontWeight: "bold" }}>
                                        {order.items.map((item: { name: string, quantity: number }, index: number) => {
                                            return <span key={index}>{item.name} <span style={{ fontWeight: "normal" }}>x {item.quantity}</span> {index === order.items.length - 1 ? "" : ", "}</span>
                                        })}
                                    </p>

                                </div>

                                <hr />

                                <div className="my-orders-order-content">
                                    <p><b>Total:</b> ${order.amount}.00</p>
                                    <p><b>Items:</b> {order.items.length}</p>
                                    <p className='status'><b>Status:</b> {order.status}</p> {/* <span>&#x25cf;</span> */}
                                    <button aria-label='Track Order'>Track Order</button>
                                </div>

                            </div>
                        ))
                }
            </div>
        </div>
    )
}

export default MyOrders
