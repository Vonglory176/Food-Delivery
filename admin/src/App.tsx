// import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import Add from './pages/add/Add'
import List from './pages/list/List'
import Orders from './pages/orders/Orders'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='App'>

      <Navbar />
      <ToastContainer />

      <hr />

      <div className="app-content">
        <Sidebar />

        <Routes>
          {/* <Route path="/" element={<List />} /> */}
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>


    </div>
  )
}

export default App
