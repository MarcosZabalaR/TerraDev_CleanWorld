import { useState, useEffect } from 'react'; // Importar useState y useEffect
import WorldMap from "../assets/worldmap.webp";
import Cloud from "../assets/cloud.png";
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  // 1. Estado para almacenar el estado de la sesión
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 2. Función para verificar si hay un usuario en localStorage
  const checkLoginStatus = () => {
    try {
      // Intenta obtener la cadena 'user' del localStorage
      const userString = localStorage.getItem('user');
      
      // Si la cadena existe Y es un JSON válido (no necesariamente comprobamos el token aquí, solo la existencia)
      if (userString) {
        // Opcional: Podrías hacer un JSON.parse() aquí para ser más estricto
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (e) {
      // En caso de error de parsing o localStorage, asumimos que no hay sesión
      setIsLoggedIn(false);
      console.error("Error al leer localStorage:", e);
    }
  };

  // 3. Usar useEffect para verificar el estado al montar el componente
  useEffect(() => {
    checkLoginStatus();
    // También podríamos añadir un listener para detectar cambios en el almacenamiento
    // window.addEventListener('storage', checkLoginStatus);
    // return () => window.removeEventListener('storage', checkLoginStatus);
  }, []); // Se ejecuta solo una vez al inicio

  return (
    <>
      <div className="bg-linear-to-b from-blue-50 to-neutral-100 h-screen flex justify-center relative overflow-hidden ">
        <div className="text-white mt-20">
          <span className="text-2xl font-medium drop-shadow-[1px_1px_0px_gray] text-brand-dark select-none pointer-events-none">
            Bienvenido a
          </span>
          <h1 className="text-9xl font-bold drop-shadow-[1px_3px_1px_gray] z-60 select-none pointer-events-none">
            <span className="text-brand-light">Clean</span><span className="text-brand-primary">World</span>
          </h1>

          <div className="flex justify-center gap-4 mt-5">
            <button
              className="bg-brand-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-dark transition duration-300 shadow-lg hover:shadow-xl z-999 cursor-pointer"
              onClick={() => navigate('/map')}
            >
              Mapa
            </button>
            
            {/* 4. Lógica Condicional: El botón de Login solo aparece si NO está logueado */}
            {!isLoggedIn && (
              <button 
                className="bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-xl hover:bg-gray-300 transition duration-300 z-999 cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>

        <img
          src={WorldMap}
          className="h-220 w-220 spin absolute top-[50vh] z-10 select-none pointer-events-none"
          alt="Mapa Mundial"
        />

        {/* DERECHA */}
        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[20vh] right-[-20vh] rotate-[-18deg] z-1 select-none pointer-events-none"
          alt="Nube decorativa"
        />

        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[35vh] right-[-54vh] rotate-[-18deg] z-1 select-none pointer-events-none"
          alt="Nube decorativa"
        />

        {/* IZQUIERDA */}
        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[25vh] left-[-50vh] rotate-16 z-1 select-none pointer-events-none"
          alt="Nube decorativa"
        />

        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[50vh] left-[-40vh] rotate-20 z-1 select-none pointer-events-none"
          alt="Nube decorativa"
        />
      </div>
    </>
  );
}

export default Home;