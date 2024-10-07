import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">

        <div className="footer-content-left">
            <Link to={"/"}><img src={assets.logo} alt="logo" /></Link>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus dignissimos maxime, corporis non officiis obcaecati exercitationem at cumque labore quasi repudiandae quod quos perspiciatis nostrum illum quisquam enim. Eius, impedit.</p>
            <ul className="footer-social-icons">
            <li>
                <a href="https://www.facebook.com" target='_blank' aria-label='Facebook'><FaFacebook size={32} /></a>
              </li>
              <li>
                <a href="https://www.twitter.com" target='_blank' aria-label='Twitter'><FaTwitter size={32} /></a>
              </li>
              <li>
                <a href="https://www.linkedin.com" target='_blank' aria-label='LinkedIn'><FaLinkedin size={32} /></a>
              </li>
            </ul>
        </div>

        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li><Link to={"/"} aria-label='Home'>Home</Link></li>
                <li><Link to={"/"} aria-label='About Us'>About Us</Link></li>
                <li><Link to={"/"} aria-label='Delivery'>Delivery</Link></li>
                <li><Link to={"/"} aria-label='Privacy Policy'>Privacy Policy</Link></li>
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
