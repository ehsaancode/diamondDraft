import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext'
import { FavoriteProvider } from './context/FavoriteContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <FavoriteProvider>
        <App />
      </FavoriteProvider>
    </CartProvider>
  </StrictMode>,
)
