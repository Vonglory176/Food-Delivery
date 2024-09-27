import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'

const LoginPopup: React.FC<LoginPopupProps> = ({ setShowLogin }) => {
  const { setToken } = useContext(StoreContext)
  const [currentState, setCurrentState] = useState<string>("Sign Up")
  const [data, setData] = useState<any>({
    name: '',
    email: '',
    password: '',
  })

  const stateIsSignUp = currentState === "Sign Up"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const url = import.meta.env.VITE_BACKEND_URL + 'api/user' + (stateIsSignUp ? '/signup' : '/login')

    if (!stateIsSignUp) {
      const response = await axios.post(url, data)
      console.log(response)

      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem('token', response.data.token)
        setShowLogin(false)
      }
      else {
        alert(response.data.message)
      }
    }
  }

  return (
    <div className='login-popup'>
      <form className='login-popup-container' action="" onSubmit={handleLogin}>

        {/* Title */}
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <button onClick={() => setShowLogin(false)}>
            <img src={assets.cross_icon} alt="close" />
          </button>
        </div>

        {/* Inputs */}
        <div className="login-popup-inputs">
          {stateIsSignUp && <input onChange={handleChange} value={data.name} type="text" name='name' placeholder='Your name' required />} {/* Hide for Login */}
          <input onChange={handleChange} value={data.email} type="email" name='email' placeholder='Your email' required />
          <input onChange={handleChange} value={data.password} type="password" name='password' placeholder='Your password' required />
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
