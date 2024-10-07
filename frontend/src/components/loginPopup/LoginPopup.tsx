import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useStore } from '../../context/StoreContext'
import { validateLoginForm } from '../../helpers/helper'

const LoginPopup = () => {
  const { setShowLogin, userLoginSignup } = useStore()
  const [currentState, setCurrentState] = useState<string>("Sign Up")
  const [data, setData] = useState<any>({
    name: 'test',
    email: 'test@gmail.com',
    password: 'abc123@W',
    terms: false
  })

  const [errors, setErrors] = useState<any>({
    name: false,
    email: false,
    password: false,
    terms: false,
    errorExists: false,
  })

  const stateIsSignUp = currentState === "Sign Up"

  // Reset Errors
  const resetErrors = () => {
    setErrors({ name: false, email: false, password: false, terms: false, errorExists: false })
  }

  const changeFormState = (state: string) => {
    setCurrentState(state)
    resetErrors()
  }

  // Handle Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target
    setData({ ...data, [name]: name === 'terms' ? checked : value })
  }

  // Handle Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validating Inputs
    if (!validateLoginForm(data, setErrors, stateIsSignUp)) return
    else resetErrors()

    // Sending Data
    userLoginSignup(data, stateIsSignUp ? 'register' : 'login', setErrors)
  }


  return (
    <div className='login-popup'>
      <form className='login-popup-container' action="" onSubmit={handleLogin}>

        {/* Title */}
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <button type='button' onClick={() => setShowLogin(false)} aria-label='Close'>
            <img src={assets.cross_icon} alt="close" />
          </button>
        </div>

        {/* Inputs */}
        <div className="login-popup-inputs">

          {/* Name */}
          {stateIsSignUp &&
            <div className="login-popup-inputs-wrapper">
              <input onChange={handleChange} className={errors.name ? 'error' : ''} maxLength={50} value={data.name} type="text" name='name' placeholder='Your name' />
              {errors.name && <p className='error-text'>{errors.name}</p>}
            </div>
          }

          {/* Email */}
          <div className="login-popup-inputs-wrapper">
            <input onChange={handleChange} className={errors.email ? 'error' : ''} maxLength={50} value={data.email} type="email" name='email' placeholder='Your email' />
            {errors.email && <p className='error-text'>{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="login-popup-inputs-wrapper">
            <input onChange={handleChange} className={errors.password ? 'error' : ''} maxLength={50} value={data.password} type="password" name='password' placeholder='Your password' />
            {errors.password && <p className='error-text'>{errors.password}</p>}
          </div>

        </div>

        {/* Submit Button */}

        <button type='submit' aria-label={currentState === "Sign Up" ? "Create Account" : "Login"}>{currentState === "Sign Up" ? "Create Account" : "Login"}</button>

        {/* Terms & Conditions / Privacy Policy */}
        {stateIsSignUp && <div className="login-popup-condition">
          <input onChange={handleChange} className={errors.terms ? 'error' : ''} type="checkbox" name='terms' checked={data.terms} required />
          <p>By continuing, you agree to our <a href="/" aria-label='Terms & Conditions'>Terms & Conditions</a> & <a href="/" aria-label='Privacy Policy'>Privacy Policy</a></p>
          {/* {errors.terms && <p className='error-text'>{errors.terms}</p>} */}
        </div>}

        {/* State Switcher */}
        {!stateIsSignUp ?
          <p>Create a new account? <button type='button' className='login-popup-signup' onClick={() => changeFormState("Sign Up")} aria-label='Sign Up'>Sign Up</button></p>

          :

          <p>Already have an account? <button className='login-popup-login' onClick={() => changeFormState("Login")} aria-label='Login'>Login</button></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
