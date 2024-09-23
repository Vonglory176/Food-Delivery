import React, { useState } from 'react'
import { assets } from '../../assets/assets'

const LoginPopup: React.FC<LoginPopupProps> = ({ setShowLogin }) => {
    const [currentState, setCurrentState] = useState<string>("Sign Up")

    const stateIsSignUp = currentState === "Sign Up"

  return (
    <div className='login-popup'>
      <form className='login-popup-container' action="">

        {/* Title */}
        <div className="login-popup-title">
            <h2>{currentState}</h2>
            <button onClick={() => setShowLogin(false)}>
                <img src={assets.cross_icon} alt="close" />
            </button>
        </div>

        {/* Inputs */}
        <div className="login-popup-inputs">
            {stateIsSignUp && <input type="text" placeholder='Your name' required />} {/* Hide for Login */}
            <input type="email" placeholder='Your email' required />
            <input type="password" placeholder='Your password' required />
        </div>

        <button type='submit'>{currentState === "Sign Up" ? "Create Account" : "Login"}</button>

        {/* Terms & Conditions / Privacy Policy */}
        <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, you agree to our <span>Terms & Conditions</span> & <span>Privacy Policy</span></p>
        </div>

        {/* State Switcher */}
        {!stateIsSignUp ? 
            <p>Create a new account? <span onClick={() => setCurrentState("Sign Up")}>Sign Up</span></p>

        :

            <p>Already have an account? <span onClick={() => setCurrentState("Login")}>Login</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
