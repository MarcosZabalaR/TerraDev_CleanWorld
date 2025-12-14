import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/CleanWorldLogo.png";
import { IconLogout, IconUser } from "@tabler/icons-react";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // autenticacion
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // 1. Obtener el string JSON del usuario desde localStorage
    const userString = localStorage.getItem("user");

    if (userString) {
      try {
        // 2. Parsear el string JSON a un objeto
        const userData = JSON.parse(userString);
        
        // 3. Verificar si el objeto contiene la información necesaria (por ejemplo, el token)
        if (userData.token && userData.name) {
          setIsAuthenticated(true);
          // Usamos 'userData.name'. ¡Asegúrate de que este campo exista en el objeto que guardas!
          setUserName(userData.name); 
          return;
        }
      } catch (e) {
        console.error("Error al parsear el usuario de localStorage:", e);
      }
    }

    // Si no hay 'userString' o el parseo falla, o faltan datos
    setIsAuthenticated(false);
    setUserName("");
    
  }, [location.pathname]); 

  //  reporte
  const handleReportClick = (e) => {
    e.preventDefault();
    // Lógica para redirigir con el parámetro `report=true`
    if (location.pathname === "/map") {
      navigate("/map?report=true", { replace: true });
    } else {
      navigate("/map?report=true");
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // 1. ELIMINAR EL OBJETO COMPLETO DE USUARIO DE localStorage
    localStorage.removeItem("user"); 
    
    // 2. Actualizar el estado local
    setIsAuthenticated(false);
    setUserName("");
    
    // 3. Redirigir al inicio o a la página de login
    navigate("/");
  };

  // Clase CSS para simplificarlo to
  const navLinkClass = "py-1 hover:underline";

  return (
    <nav className="flex bg-brand-primary text-white font-bold p-4 h-20 items-center relative z-50">
     
      <h1>
        <Link to="/" className="flex items-center gap-1 text-lg">
          <img
            src={Logo}
            alt="CleanWorld Logo"
            className="w-8 h-8 object-contain mr-2 bg-white rounded-md"
          />
          CleanWorld
        </Link>
      </h1>

      {/* Enlaces */}
      <ul className="flex font-medium gap-4 justify-center grow items-center">
        <li>
          <Link to="/map" className={navLinkClass}>
            Mapa
          </Link>
        </li>
        <li>
          <Link to="/zones" className={navLinkClass}>
            Zonas
          </Link>
        </li>
        <li>
          <Link to="/events" className={navLinkClass}>
            Eventos
          </Link>
        </li>
        
    
        <li>
          <button
            onClick={handleReportClick}
            className="px-3 py-2 rounded-xl bg-brand-light text-brand-dark font-bold transition-colors hover:bg-neutral-200"
          >
            Reportar zona
          </button>
        </li>

      
        {isAuthenticated && (
          <>
            <li>
              <Link to="/profile" className={navLinkClass}>
                Perfil
              </Link>
            </li>
            <li>
              <Link to="/points" className={navLinkClass}>
                Recompensas
              </Link>
            </li>
          </>
        )}
      </ul>

    
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          // Si el usuario está autenticado
          <>
            <span className="flex items-center gap-1 text-sm text-brand-light font-medium px-2">
              <IconUser size={18} /> ¡Bienvenido {userName}!
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-brand-warm text-white font-bold transition-colors hover:bg-red-700 flex items-center gap-1"
              title="Cerrar Sesión"
            >
              <IconLogout size={20} />
              Cerrar Sesión
            </button>
          </>
        ) : (
          // Si el usuario NO está autenticado
          <>
            <Link
              to="/login"
              
              className="hover:underline px-3 py-2 rounded-xl text-white font-bold transition-colors hover:bg-brand-secondary"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              
              className="px-3 py-2 rounded-xl bg-brand-light text-brand-dark font-bold transition-colors hover:bg-white"
            >
              Registro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}