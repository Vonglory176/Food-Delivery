import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar: React.FC<NavbarProps> = ({ setShowLogin }) => {
  const [menu, setMenu] = useState<string>("Home")
  const { cartHasItems } = useContext(StoreContext) // getTotalCartAmount

  return (
    <div className='navbar'>
      <Link to={"/"}><img src={assets.logo} alt="logo" /></Link>
      <ul className="navbar-menu">
        <li>
          <Link to={"/"} onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
        </li>
        <li>
          <a href="#explore-menu" onClick={() => setMenu("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</a>
        </li>
        <li>
          <a href="#app-download" onClick={() => setMenu("Mobile-App")} className={menu === "Mobile-App" ? "active" : ""}>Mobile-App</a>
        </li>
        <li>
          <a href="#footer" onClick={() => setMenu("Contact Us")} className={menu === "Contact Us" ? "active" : ""}>Contact Us</a>
        </li>
      </ul>

      <div className="navbar-right">
        {/* <img src={assets.search_icon} alt="search" /> */}

        <div className="navbar-search-icon">
          <Link to={"/cart"}><img src={assets.basket_icon} alt="basket" /></Link>
          <div className={cartHasItems ? "dot" : ""}></div>
          {/* <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div> */}
        </div>

        <button onClick={() => setShowLogin(true)}>Sign In</button>

      </div>

    </div>
  )
}

export default Navbar
