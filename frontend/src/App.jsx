import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Leaflet
import "leaflet/dist/leaflet.css";

// Pages
import HomePage from './pages/Home.jsx';
import MapaPage from './pages/Map.jsx';
import Login from './pages/Login.jsx';

// Components
import Footer from './components/Footer'

function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <main className="grow">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
			<Route path="/mapa" element={<MapaPage />} />
		  </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
