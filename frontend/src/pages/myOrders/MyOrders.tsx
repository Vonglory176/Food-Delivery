import { useEffect, useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { assets } from '../../assets/assets'

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
                <div className="spinner-wrapper"><div className="spinner"></div></div>
                
                :

                // No orders
                orders.length === 0 ? <p className='no-orders'>You have no orders</p>
                
                :
                
                // Orders
                orders.map((order, index: number) => (
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="" />

                        <p>{order.items.map((item, index: number) => {

                            return  item.name + " x " + item.quantity + (index === order.items.length - 1 ? ", " : "")

                            // if (index === order.items.length - 1) {
                            //      return item.name + " x " + item.quantity
                            // }
                            // return item.name + " x " + item.quantity + ", "
                        })}</p>

                        <p>${order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                        <button>Track Order</button>
                    </div>
                ))
                }
            </div>
        </div>
    )
}

export default MyOrders
