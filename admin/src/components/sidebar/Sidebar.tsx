// import React from 'react'
import { FaList, FaUtensils, FaPlusCircle } from 'react-icons/fa'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">

        <NavLink to="/add" className="sidebar-option" title='Add Food' aria-label='Add Food'>
          {/* <img src={assets.add_icon} alt="" /> */}
          <FaPlusCircle size={24} />
          <p>Add Food</p>
        </NavLink>

        <NavLink to="/foods" className="sidebar-option" title='Food List' aria-label='Food List'>
          {/* <img src={assets.order_icon} alt="" /> */}
          <FaUtensils size={24} />
          <p>Food List</p>
        </NavLink>

        <NavLink to="/orders" className="sidebar-option" title='Order List' aria-label='Order List'>
          {/* <img src={assets.order_icon} alt="" /> */}
          <FaList size={24} />
          <p>Order List</p>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar
