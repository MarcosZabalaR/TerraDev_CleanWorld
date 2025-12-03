import NavBar from '../components/NavBar.jsx';
import Mapa from '../components/Map.jsx';
import RecyclingMenu from '../components/RecyclingMenu.jsx';

export default function MapaPage() {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 relative">
        <Mapa />
        <RecyclingMenu />
      </div>
    </div>
  );
}