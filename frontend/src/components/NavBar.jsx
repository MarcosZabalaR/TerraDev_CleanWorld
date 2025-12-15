import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/CleanWorldLogo.png";
import Avatar from "../assets/Avatar.jpg"; 
import { IconLogout, IconUser, IconChevronDown, IconChevronUp } from "@tabler/icons-react"; 
import LangSwitcher from "../components/langSwitcher";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatarURL, setUserAvatarURL] = useState(null); 
  
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
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Verificar autenticación
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        if (userData.token && userData.name) {
          setIsAuthenticated(true);
          setUserName(userData.name); 
          setUserAvatarURL(userData.profilePicture || null); 
          return;
        }
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
    setIsAuthenticated(false);
    setUserName("");
    setUserAvatarURL(null); 
  }, [location.pathname]); 

  // Reportar zona
  const handleReportClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/map") {
      navigate("/map?report=true", { replace: true });
    } else {
      navigate("/map?report=true");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user"); 
    setIsAuthenticated(false);
    setUserName("");
    setUserAvatarURL(null); 
    setIsDropdownOpen(false);
    navigate("/");
  };
  
  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  }

  const navLinkClass = "py-1 hover:underline";
  const avatarSrc = userAvatarURL || Avatar;

  return (
    <nav className="flex bg-brand-primary text-white font-bold p-4 h-20 items-center relative z-9999 justify-between">
     
      {/* Logo */}
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
          <Link to="/map" className={navLinkClass}>Mapa</Link>
        </li>
        <li>
          <Link to="/zones" className={navLinkClass}>Zonas</Link>
        </li>
        <li>
          <Link to="/events" className={navLinkClass}>Eventos</Link>
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
          <li>
            <Link to="/points" className={navLinkClass}>Recompensas</Link>
          </li>
        )}
      </ul>

      {/* Zona derecha: LangSwitcher y usuario */}
      <div className="flex items-center gap-3">
        <LangSwitcher />

        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-secondary text-white font-bold transition-colors hover:bg-brand-dark"
              aria-expanded={isDropdownOpen}
              aria-controls="profile-menu"
            >
              <img 
                src={avatarSrc}
                alt="Avatar de usuario"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="truncate max-w-[100px]">{userName}</span>
              {isDropdownOpen ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
            </button>

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
