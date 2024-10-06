import { useEffect } from 'react'
import { useAdmin } from '../../context/adminContext'
import Spinner from '../../components/spinner/Spinner'
import { FaTrash } from 'react-icons/fa'

const Foods = () => {
  const { getFood, removeFood, foodList, isLoading } = useAdmin()

  useEffect(() => {
    getFood()
  }, [])

  return (
    <div className='foods page flex-col'>
      <h3>Food List</h3>
      <div className="foods-table">
        <div className="foods-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {isLoading && foodList.length === 0 ? 
        
          // Loading Spinner
          <Spinner />

          :

          // Food List
          foodList && foodList.map((item, index) => {
            return (
              <div className="foods-table-format" key={index}>

                <div className="img-wrapper">
                  <img src={`${import.meta.env.VITE_BACKEND_URL}/images/${item.image}`} alt="Food" />
                </div>


                <div className="item-name">
                  <b>Name:</b>
                  <p>{item.name}</p>
                </div>
                <div className="item-description">
                  <b>Description:</b>
                  <p>{item.description}</p>
                </div>
                <div className="item-category">
                  <b>Category:</b>
                  <p>{item.category}</p>
                </div>
                <div className="item-price">
                  <b>Price:</b>
                  <p>${item.price}</p>
                </div>                
                <div className="item-actions">
                  <b>Actions:</b>
                  <button onClick={() => removeFood(item._id)} className='cursor' aria-label='Remove' title='Remove'><FaTrash size={20} /></button>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Foods
