import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { assets } from '../../assets/assets'

const MyOrders = () => {

    const { token } = useContext(StoreContext)
    const [data, setData] = useState<any>([])

    const fetchOrders = async () => {
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/order/user-list', {}, {
                headers: {
                    // 'Authorization': `Bearer ${token}`
                    token
                }
            })

            setData(response.data.data)

        } catch (error) {
            console.log(error)
        }
    }

    // Fetch orders
    useEffect(() => {
        if (token) fetchOrders()
    }, [])

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>

            <div className="container">
                {data.map((order, index: number) => (
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
                ))}
            </div>
        </div>
    )
}

export default MyOrders
