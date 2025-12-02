import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import Login from './components/Login.jsx'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<p>La página no existe</p>} />
      </Routes>

      <p className="font-bold border-2 text-amber-300">Mondongo</p>
    </>
  )
}

export default App
