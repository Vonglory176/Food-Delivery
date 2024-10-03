// import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">

        <div className="footer-content-left">
            <Link to={"/"}><img src={assets.logo} alt="logo" /></Link>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus dignissimos maxime, corporis non officiis obcaecati exercitationem at cumque labore quasi repudiandae quod quos perspiciatis nostrum illum quisquam enim. Eius, impedit.</p>
            <ul className="footer-social-icons">
              <li>
                <a href="https://www.facebook.com" target='_blank' aria-label='Facebook'><img src={assets.facebook_icon} alt="facebook" /></a>
              </li>
              <li>
                <a href="https://www.twitter.com" target='_blank' aria-label='Twitter'><img src={assets.twitter_icon} alt="twitter" /></a>
              </li>
              <li>
                <a href="https://www.linkedin.com" target='_blank' aria-label='LinkedIn'><img src={assets.linkedin_icon} alt="linkedin" /></a>
              </li>
            </ul>
        </div>

        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li><Link to={"/"}>Home</Link></li>
                <li><Link to={"/"}>About Us</Link></li>
                <li><Link to={"/"}>Delivery</Link></li>
                <li><Link to={"/"}>Privacy Policy</Link></li>
            </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li><a href="tel:+1-234-567-8910" aria-label='Call us'>+1-234-567-8910</a></li>
            <li><a href="mailto:contact@company.com" aria-label='Email us'>contact@company.com</a></li>
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
