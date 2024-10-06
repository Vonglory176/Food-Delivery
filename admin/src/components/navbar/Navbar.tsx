// import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAdmin } from '../../context/adminContext'

const Navbar = () => {
  const { userLogout } = useAdmin()

  return (

    <div className='navbar'>

      {/* <Link to='/'> */}
      <img className='logo' src={assets.logo} alt="logo" />
      {/* </Link> */}

      {/* <img className="profile" src={assets.profile_image} alt="profile" /> */}
      <button className='logout-btn' onClick={userLogout} aria-label='logout'>
        {/* <img src={assets.logout_icon} alt="" />  */}
        Logout
      </button>

    </div>

  )
}

export default Navbar
