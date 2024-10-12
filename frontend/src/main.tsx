import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import StoreContextProvider from './context/StoreContext.tsx'
import axios from 'axios'

// Set withCredentials globally
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename='/'> {/* /Food-Delivery/ */}
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </BrowserRouter>
)
