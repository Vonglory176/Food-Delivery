import React, { useState } from 'react'
import { validateLoginForm } from '../../helpers/helper'
import { useAdmin } from '../../context/adminContext'

const LoginPopup = ({ isRegister }: { isRegister: boolean }) => {
  const { setShowLogin, userLoginSignup } = useAdmin()
  // const [currentState, setCurrentState] = useState<string>("Sign Up")
  const [formData, setFormData] = useState<any>({
    name: 'Admin Demo',
    email: 'Admin-Demo@gmail.com',
    password: 'abc123@W',
    demo: false
  })

  const [errors, setErrors] = useState<any>({
    name: false,
    email: false,
    password: false,
    errorExists: false,
  })

  // Reset Errors
  const resetErrors = () => {
    setErrors({ name: false, email: false, password: false, errorExists: false })
  }

  // const changeFormState = (state: string) => {
  //   setCurrentState(state)
  //   resetErrors()
  // }

  // Handle Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target
    setFormData({ ...formData, [name]: name === 'demo' ? checked : value })
  }

  // Handle Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validating Inputs
    if (!validateLoginForm(formData, setErrors, isRegister)) return
    else resetErrors()


    // Sending Data
    userLoginSignup(formData, isRegister ? 'register' : 'login', setErrors)
  }


  return (
    <div className='login-popup'>
      <form className='login-popup-container' action="" onSubmit={handleLogin}>

        {/* Title */}
        <div className="login-popup-title">
          <h2>{isRegister ? "Create Account" : "Login"}</h2>
          {/* <button type='button' onClick={() => setShowLogin(false)}> */}
            {/* <img src={assets.cross_icon} alt="close" /> */}
            {/* <FaTimes className="close-icon" size={16} /> */}
          {/* </button> */}
        </div>

        {/* Inputs */}
        <div className="login-popup-inputs">

          {/* Name */}
          {isRegister &&
            <div className="login-popup-inputs-wrapper">
              <input onChange={handleChange} className={errors.name ? 'error' : ''} maxLength={50} value={formData.name} type="text" name='name' placeholder='Your name' />
              {errors.name && <p className='error-text'>{errors.name}</p>}
            </div>
          }

          {/* Email */}
          <div className="login-popup-inputs-wrapper">
            <input onChange={handleChange} className={errors.email ? 'error' : ''} maxLength={50} value={formData.email} type="email" name='email' placeholder='Your email' />
            {errors.email && <p className='error-text'>{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="login-popup-inputs-wrapper">
            <input onChange={handleChange} className={errors.password ? 'error' : ''} maxLength={50} value={formData.password} type="password" name='password' placeholder='Your password' />
            {errors.password && <p className='error-text'>{errors.password}</p>}
          </div>

        </div>

        {/* Admin Demo */}
        {isRegister && <div className="login-popup-condition">
          <input onChange={handleChange} className={errors.demo ? 'error' : ''} type="checkbox" name='demo' checked={formData.demo} />
          <p>Check if this acount is for demo purposes only.</p>
        </div>}

        {/* Submit Button */}
        <button type='submit'>{isRegister ? "Create Account" : "Login"}</button>

      </form>
    </div>
  )
}

export default LoginPopup
