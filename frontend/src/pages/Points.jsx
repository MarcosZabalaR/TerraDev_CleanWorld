import { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

// img
import adidas from "../assets/tutifruti.jpeg";
import footlocker from "../assets/images.jpeg";
import hm from "../assets/mesondepaco.jpeg";
import lol from "../assets/thyssen.webp";
import rakuten from "../assets/krustypark.jpg";
import roblox from "../assets/casa-kiki-plaza-palmera.jpg";

// tablericon
import {
  IconCircleCheckFilled,
  IconAwardFilled,
  IconHeartFilled,
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconX, // Necesario para el botón de cerrar del modal
} from "@tabler/icons-react";

// Componente Modal simple para la notificación
const RedemptionModal = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          <IconX size={24} />
        </button>
        <h3 className="text-2xl font-bold mb-4 text-neutral-800">Estado del Canjeo</h3>
        <p className="text-lg text-neutral-600">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary/90 transition"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default function Points() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [points, setPoints] = useState(null);
  
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const toggleTutorial = () => {
    setShowTutorial(!showTutorial);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userLocal = JSON.parse(localStorage.getItem("user"));
        if (!userLocal?.id || !userLocal?.token) {
          console.warn("Usuario no autenticado o ID faltante");
          setPoints(0);
          return;
        }
  
        const response = await fetch(`${API_BASE_URL}/users/${userLocal.id}`, {
          headers: {
            "Authorization": `Bearer ${userLocal.token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) throw new Error("Error fetching user data.");
  
        const data = await response.json();
        setPoints(data.points ?? 0);
      } catch (e) {
        console.error("Error fetching user:", e);
        setPoints(0);
      }
    };
  
    fetchUser();
  }, []);

  const handleRedeem = (cost) => {
    if (points === null) {
      setModalMessage("Los puntos aún están cargando. Inténtalo de nuevo.");
      setShowModal(true);
      return;
    }

    if (points >= cost) {
      const newPoints = points - cost;
      setPoints(newPoints);

      // Mensaje de éxito para el modal
      setModalMessage(
        `¡Recompensa canjeada con éxito! Se han restado ${cost} puntos. Tus nuevos puntos son: ${newPoints}`
      );
      setShowModal(true);
      
      // En un caso real, aquí iría la llamada a la API para actualizar los puntos
      // y registrar la transacción.

    } else {
      // Mensaje de error para el modal
      setModalMessage(
        `No tienes suficientes puntos para canjear esta recompensa. Necesitas ${cost} puntos.`
      );
      setShowModal(true);
    }
  };
  
  // Componente de Recompensa (Integrado para simplificar)
  const RewardCard = ({ img, title, cost }) => (
    <div className="relative z-0 hover:z-0 rounded-lg shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden transition transform hover:scale-105">
      <div
        className="h-48 bg-gray-200 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      ></div>
      <div className="mt-7 p-4 flex flex-col items-center text-center">
        <h3 className="font-medium text-2xl mb-2">
          {title}
        </h3>
        <div className="grid grid-cols-2 gap-10 pt-8 pb-2">
          <span className="text-brand-primary font-bold text-xl pt-1">
            {cost} pts
          </span>
          <button 
            onClick={() => handleRedeem(cost)}
            className="px-3 py-1 rounded-lg font-medium border-2 border-neutral-600 text-neutral-600 cursor-pointer transition hover:scale-110 bg-neutral-100"
          >
            Canjear
          </button>
        </div>
      </div>
    </div>
  );


  return (
    <>
      <Navbar />
      
      {/* El Modal de Canjeo se renderiza aquí */}
      <RedemptionModal 
        show={showModal} 
        message={modalMessage} 
        onClose={closeModal} 
      />

      <div className="relative">
        {/* Cabecera de la página */}
        <section className="bg-neutral-100 py-13">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-8xl text-neutral-800 font-bold mb-4">
              ¡Enhorabuena!
            </h1>

            <h2 className="text-neutral-800 text-4xl font-semibold mb-4">
              Has acumulado:{" "}
              <span className="text-brand-primary">
                {points !== null ? `${points} puntos` : "Cargando..."}
              </span>
            </h2>

            <div className="flex items-center justify-center gap-1 pt-3">
              <button
                onClick={toggleTutorial}
                className="flex flex-nowrap text-gray-400 text-md cursor-pointer transition hover:scale-105 hover:text-brand-warm focus:outline-none"
              >
                ¿Cómo puedo ganar puntos?
                {showTutorial ? (
                  <IconCaretUpFilled size={20} className="text-inherit ml-2" />
                ) : (
                  <IconCaretDownFilled
                    size={20}
                    className="text-inherit ml-2"
                  />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Tutorial  */}
        <div
          className={`
            grid grid-cols-3 w-full 
            transform transition-all duration-500 ease-in-out
            overflow-hidden
            ${showTutorial ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          {/* 1 */}
          <div className="bg-amber-100 grid grid-cols-1 text-center place-items-center px-6 py-10">
            <span className="pb-15">
              <IconCircleCheckFilled size={72} className="text-neutral-800" />
            </span>
            <h3 className="text-5xl pb-2">Inicia sesión</h3>
            <p className="text-lg max-w-md">
              Primero crea una cuenta CleanWorld o inicia sesión para empezar tu
              aventura
            </p>
          </div>

          {/* 2 */}
          <div className="bg-blue-100 grid grid-cols-1 text-center place-items-center px-6 py-10">
            <span className="pb-15">
              <IconAwardFilled size={72} className="text-neutral-800" />
            </span>
            <h3 className="text-5xl pb-2">Gana puntos</h3>
            <p className="text-lg max-w-md">
              Participa en eventos para ganar puntos y canjearlos por increíbles
              recompensas.
            </p>
          </div>

          {/* 3 */}
          <div className="bg-purple-100 grid grid-cols-1 text-center place-items-center px-6 py-10">
            <span className="pb-15">
              <IconHeartFilled size={72} className="text-neutral-800" />
            </span
            >
            <h3 className="text-5xl pb-2">Consigue recompensas</h3>
            <p className="text-lg max-w-md">
              Visita nuestro panel de recompensas para cambiar tus puntos por
              los mejores premios.
            </p>
          </div>
        </div>

        {/* Sección de recompensas */}
        <section className="max-w-7xl mx-auto mt-10 px-4 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* Recompensa 1 - Rakuten TV */}
            <RewardCard 
              img={rakuten} 
              title="Krustypark: 5€ de descuento" 
              cost={800} 
            />

            {/* Recompensa 2 - Roblox */}
            <RewardCard 
              img={roblox} 
              title="Palmera gratis en Casa Kiki" 
              cost={950} 
            />

            {/* Recompensa 3 - Adidas */}
            <RewardCard 
              img={adidas} 
              title="Heladeria Tuttifrutti" 
              cost={1850} 
            />

            {/* Recompensa 4 - League of Legends */}
            <RewardCard 
              img={lol} 
              title="Día gratis en Museo Thyssen" 
              cost={1300} 
            />

            {/* Recompensa 5 - H&M */}
            <RewardCard 
              img={hm} 
              title="Cena gratis en Mesón Paco" 
              cost={2650} 
            />

            {/* Recompensa 6 - FootLocker */}
            <RewardCard 
              img={footlocker} 
              title="Almuerza gratis en el Portón" 
              cost={1800} 
            />

          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}