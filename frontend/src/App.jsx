import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Leaflet
import "leaflet/dist/leaflet.css";

// Pages
import HomePage from './pages/Home.jsx';
import MapaPage from './pages/Map.jsx';
import ZonesPage from './pages/Zones.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Error404 from './pages/Error404.jsx';

function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
			<Route path="/map" element={<MapaPage />} />
			<Route path="/zones" element={<ZonesPage />} />
            <Route path='*' element={<Error404 />} />
		  </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
