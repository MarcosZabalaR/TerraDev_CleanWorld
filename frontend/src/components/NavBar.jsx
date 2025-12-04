import { Link } from 'react-router-dom';
import Logo from '../assets/CleanWorldLogo.png';

export default function NavBar() {

	  return (
	  <>
		<nav className="flex bg-brand-primary text-white font-bold p-4 h-20 items-center">
			<h1><Link to="/home" className="flex items-center gap-1 text-lg"><img src={Logo} alt="CleanWorld Logo" className="w-8 h-8 object-contain mr-2 bg-white rounded-md"/>CleanWorld</Link></h1>
			<ul className="flex font-medium gap-4 justify-center grow">
				<li><Link to="/mapa" className="p-2 hover:underline">Mapa</Link></li>
				<li><Link to="/zonas" className="p-2 hover:underline">Zonas</Link></li>
				<li><Link to="/eventos" className="p-2 hover:underline">Eventos</Link></li>
				<li><Link to="/perfil" className="p-2 hover:underline">Perfil</Link></li>
			</ul>
			<button><Link to="/mapa?report=true" className="p-2 rounded-xl bg-brand-light text-brand-dark font-bold transition-colors hover:bg-white">+ Reportar</Link></button>
		</nav>
	  </>
	);
}