import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Verify = () => {

    const [searchParams] = useSearchParams()
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const navigate = useNavigate()

    const verifyPayment = async () => {
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/order/verify', { success, orderId })

            if (response.data.success) {
                navigate('/myorders')
            }
            else {
                navigate('/')
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [])

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify
