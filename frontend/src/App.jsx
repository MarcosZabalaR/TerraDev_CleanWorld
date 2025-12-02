import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="grow">
          <Routes>
            <Route path="/" element={<p className="font-bold border-2 text-amber-300">Mondongo</p>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
