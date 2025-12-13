import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/CleanWorldLogo.png";
import { IconLogout, IconUser } from "@tabler/icons-react";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para manejar la autenticación y el nombre de usuario
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Simulación: Obtener el estado de autenticación y el nombre de usuario de localStorage
    const userId = localStorage.getItem("id");
    const storedUserName = localStorage.getItem("userName"); // Asume que guardas el nombre aquí

    if (userId && storedUserName) {
      setIsAuthenticated(true);
      setUserName(storedUserName);
    } else {
      setIsAuthenticated(false);
      setUserName("");
    }
  }, [location.pathname]); // Revisa el estado de auth cada vez que la ruta cambia (útil después de login/logout)

  // Función para manejar el reporte
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
    // 1. Eliminar datos del usuario de localStorage
    localStorage.removeItem("id");
    localStorage.removeItem("userName");
    // 2. Actualizar el estado local
    setIsAuthenticated(false);
    setUserName("");
    // 3. Redirigir al inicio o a la página de login
    navigate("/");
  };

  // Clase CSS común para los enlaces de navegación para asegurar el padding vertical
  const navLinkClass = "py-1 hover:underline";

  return (
    <nav className="flex bg-brand-primary text-white font-bold p-4 h-20 items-center relative z-50">
      {/* Logo y Nombre de la Aplicación */}
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

      {/* Enlaces de Navegación Centrales */}
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
        
        {/* BOTÓN REPORTAR: Se usa 'bg-white' para hacerlo más claro y se mantiene la alineación con 'items-center' en UL */}
        <li>
          <button
            onClick={handleReportClick}
            className="px-3 py-2 rounded-xl bg-brand-light text-brand-dark font-bold transition-colors hover:bg-neutral-200"
          >
            Reportar zona
          </button>
        </li>

        {/* Enlaces condicionales para usuarios autenticados */}
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

      {/* Lógica de Autenticación */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          // Si el usuario está autenticado
          <>
            <span className="flex items-center gap-1 text-sm text-brand-light font-medium px-2">
              <IconUser size={18} /> Hola, {userName}!
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-red-600 text-white font-bold transition-colors hover:bg-red-700 flex items-center gap-1"
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
              // MISMO HOVER QUE EL RESTO: Se mantiene el fondo oscuro pero con el mismo padding que el botón de Reportar
              className="hover:underline px-3 py-2 rounded-xl text-white font-bold transition-colors hover:bg-brand-secondary"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              // REGISTRO: Usamos 'bg-brand-light' para que sea más oscuro que el de Reportar (que ahora es 'bg-white')
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