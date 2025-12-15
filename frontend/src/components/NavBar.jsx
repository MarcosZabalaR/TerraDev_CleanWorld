import { useState, useEffect, useRef } from "react"; // Importar useRef para el menú desplegable
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/CleanWorldLogo.png";
import { IconLogout, IconUser, IconChevronDown, IconChevronUp } from "@tabler/icons-react"; // Añadir iconos

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  // Estado para el menú desplegable
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Referencia para detectar clics fuera del menú
  const dropdownRef = useRef(null);

  // Función para cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    // Adjuntar y limpiar el listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // Efecto para verificar la autenticación
  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (userString) {
      try {
        const userData = JSON.parse(userString);
        
        if (userData.token && userData.name) {
          setIsAuthenticated(true);
          setUserName(userData.name); 
          return;
        }
      } catch (e) {
        console.error("Error al parsear el usuario de localStorage:", e);
      }
    }

    setIsAuthenticated(false);
    setUserName("");
    
  }, [location.pathname]); 

  //  reporte
  const handleReportClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/map") {
      navigate("/map?report=true", { replace: true });
    } else {
      navigate("/map?report=true");
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("user"); 
    setIsAuthenticated(false);
    setUserName("");
    setIsDropdownOpen(false); // Cierra el menú al cerrar sesión
    navigate("/");
  };
  
  // Función para navegar al perfil desde el desplegable
  const handleProfileClick = () => {
      setIsDropdownOpen(false);
      navigate("/profile");
  }

  // Clase CSS para simplificarlo
  const navLinkClass = "py-1 hover:underline";

  return (
    <nav className="flex bg-brand-primary text-white font-bold p-4 h-20 items-center relative z-9999">

     
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
            {/* El enlace a Perfil y Logout ya no están aquí, están en el desplegable. */}
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
          // Si el usuario está autenticado, muestra el desplegable
          <div className="relative" ref={dropdownRef}>
            {/* Botón/Etiqueta que activa el desplegable */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-secondary text-white font-bold transition-colors hover:bg-brand-dark"
              aria-expanded={isDropdownOpen}
              aria-controls="profile-menu"
            >
              <IconUser size={20} />
              <span className="truncate max-w-[100px]">{userName}</span>
              {isDropdownOpen ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
            </button>

            {/* Menú Desplegable */}
            {isDropdownOpen && (
              <div 
                id="profile-menu"
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-1 text-gray-800 border border-gray-200"
              >
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100"
                >
                  <IconUser size={18} /> Perfil
                </button>
                
                <hr className="my-1 border-gray-100" />
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 flex items-center gap-2 hover:bg-red-50 hover:text-red-700"
                >
                  <IconLogout size={18} /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
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