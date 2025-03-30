import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Carnes from './carnes.jsx'
import Login from './login.jsx'
import Aseo from './aseo.jsx'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/carnes" element={<Carnes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aseo" element={<Aseo />} />
      </Routes>
    </Router>
  </StrictMode>,
)
