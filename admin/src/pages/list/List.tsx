import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const List = () => {
  const [list, setList] = useState<any>([])

  const fetchList = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/food/list`)
    console.log(response.data)

    if (response.data.success) {
      setList(response.data.foodList)
    }
    else {
      toast.error("Error! Couldn't fetch list")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const handleRemove = async (foodId: string) => {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/food/remove/${foodId}`)
    console.log(response.data)

    if (response.data.success) {
      toast.success(response.data.message)
      fetchList()
    }
    else {
      toast.error("Error! Couldn't remove food")
    }
  }

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list && list.map((item, index) => {
          return (
            <div className="list-table-format" key={index}>
              <img src={`${import.meta.env.VITE_BACKEND_URL}/images/${item.image}`} alt="Food" />
              <p>{item.name}</p>
              <p>{item.description}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p onClick={() => handleRemove(item._id)} className='cursor'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
