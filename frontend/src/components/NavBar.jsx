import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/CleanWorldLogo.png';

export default function NavBar() {
	const navigate = useNavigate();
	const location = useLocation();

	const handleReportClick = (e) => {
		e.preventDefault();
		if (location.pathname === '/map') {
			navigate('/map?report=true', { replace: true });
		} else {
			navigate('/map?report=true');
		}
	};

	  return (
	  <>
		<nav className="flex bg-brand-primary text-white font-bold p-4 h-20 items-center relative z-50">
			<h1><Link to="/" className="flex items-center gap-1 text-lg"><img src={Logo} alt="CleanWorld Logo" className="w-8 h-8 object-contain mr-2 bg-white rounded-md"/>CleanWorld</Link></h1>
			<ul className="flex font-medium gap-4 justify-center grow">
				<li><Link to="/map" className="p-2 hover:underline">Mapa</Link></li>
				<li><Link to="/zones" className="p-2 hover:underline">Zonas</Link></li>
				<li><Link to="/events" className="p-2 hover:underline">Eventos</Link></li>
				<li><Link to="/profile" className="p-2 hover:underline">Perfil</Link></li>
			</ul>
			<button onClick={handleReportClick} className="p-2 rounded-xl bg-brand-light text-brand-dark font-bold transition-colors hover:bg-white">Reportar</button>
		</nav>
	  </>
	);
}