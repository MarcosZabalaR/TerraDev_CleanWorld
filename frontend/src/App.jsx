import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'

function App() {

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<p className="font-bold border-2 text-amber-300">Mondongo</p>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
