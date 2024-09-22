import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">

        <div className="footer-content-left">
            <img src={assets.logo} alt="logo" />
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus dignissimos maxime, corporis non officiis obcaecati exercitationem at cumque labore quasi repudiandae quod quos perspiciatis nostrum illum quisquam enim. Eius, impedit.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="facebook" />
                <img src={assets.twitter_icon} alt="twitter" />
                <img src={assets.linkedin_icon} alt="linkedin" />
            </div>
        </div>

        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+1-234-567-8910</li>
            <li>contact@company.com</li>
          </ul>
        </div>
      </div>

        <hr />

        <div className="footer-content-bottom">
            <p>Copyright © Skyler 2024 - All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer
