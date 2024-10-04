import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

const Verify = () => {

    const { verifyOrder } = useStore()
    const [searchParams] = useSearchParams()
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')


    useEffect(() => {
        verifyOrder(success === 'true', orderId || '')
    }, [])
    

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify




    // const verifyPayment = async () => {
    //     try {
    //         const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/order/verify', { success, orderId })

    //         if (response.data.success) {
    //             navigate('/myorders')
    //         }
    //         else {
    //             navigate('/')
    //         }

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }