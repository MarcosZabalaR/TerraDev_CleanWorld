import { useState } from "react"; // Añade esta importación
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

// img
import adidas from "../assets/adidas.png";
import footlocker from "../assets/footlocker.png";
import hm from "../assets/hm.png";
import lol from "../assets/lol.png";
import rakuten from "../assets/rakuten.png";
import roblox from "../assets/roblox.png";

// tablericon
import {
  IconCircleCheckFilled,
  IconAwardFilled,
  IconHeartFilled,
  IconCaretDownFilled,
  IconCaretUpFilled, 
} from "@tabler/icons-react";

export default function Points() {
  // Estado para controlar la visibilidad del tutorial
  const [showTutorial, setShowTutorial] = useState(false);

  // Función para alternar la visibilidad
  const toggleTutorial = () => {
    setShowTutorial(!showTutorial);
  };

  return (
    <>
      <Navbar />

      <div className="relative">
        {/* Cabecera de la página */}
        <section className="bg-neutral-100 py-13">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-8xl text-neutral-800 font-bold mb-4">
              ¡Enhorabuena!
            </h1>

            <h2 className="text-neutral-800 text-4xl font-semibold mb-4">
              Has acumulado:{" "}
              <span className="text-brand-primary">1762 puntos</span>
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
                  <IconCaretDownFilled size={20} className="text-inherit ml-2" />
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
            ${showTutorial ? 
              "max-h-screen opacity-100" : 
              "max-h-0 opacity-0"
            }
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
            </span>
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
            {/* Recompensa 1 */}
            <div className="relative z-0 hover:z-0 rounded-lg shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden transition transform hover:scale-105">
              <div
                className="h-48 bg-gray-200 flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${rakuten})` }}
              ></div>
              <div className="mt-7 p-4 flex flex-col items-center text-center">
                <h3 className="font-medium text-2xl mb-2">
                  Rakuten TV: 1 Película en HD
                </h3>
                <div className="grid grid-cols-2 gap-10 pt-8 pb-2">
                  <span className="text-brand-primary font-bold text-xl pt-1">
                    800 pts
                  </span>
                  <button className="px-3 py-1 rounded-lg font-medium border-2 border-neutral-600 text-neutral-600 cursor-pointer transition hover:scale-110 bg-neutral-100">
                    Canjear
                  </button>
                </div>
              </div>
            </div>

            {/* Recompensa 2 */}
            <div className="relative z-0 hover:z-0 shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] rounded-lg overflow-hidden transition hover:scale-105">
              <div
                className="h-48 bg-gray-200 flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${roblox})` }}
              ></div>
              <div className="mt-7 p-4 flex flex-col items-center text-center">
                <h3 className="font-medium text-2xl mb-2">
                  Tarjeta digital de Roblox
                </h3>
                <div className="grid grid-cols-2 gap-10 pt-8 pb-2">
                  <span className="text-brand-primary font-bold text-xl pt-1">
                    950 pts
                  </span>
                  <button className="px-3 py-1 rounded-lg font-medium border-2 border-neutral-600 text-neutral-600 cursor-pointer transition hover:scale-110 bg-neutral-100">
                    Canjear
                  </button>
                </div>
              </div>
            </div>

            {/* Recompensa 3 */}
            <div className="relative z-0 hover:z-0 rounded-lg shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.22] overflow-hidden transition hover:scale-105">
              <div
                className="h-48 bg-gray-200 flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${adidas})` }}
              ></div>
              <div className="mt-7 p-4 flex flex-col items-center text-center">
                <h3 className="font-medium text-2xl mb-2">
                  Tarjeta regalo de Adidas
                </h3>
                <div className="grid grid-cols-2 gap-10 pt-8 pb-2">
                  <span className="text-brand-primary font-bold text-xl pt-1">
                    1850 pts
                  </span>
                  <button className="px-3 py-1 rounded-lg font-medium border-2 border-neutral-600 text-neutral-600 cursor-pointer transition hover:scale-110 bg-neutral-100">
                    Canjear
                  </button>
                </div>
              </div>
            </div>

            {/* Recompensa 4 */}
            <div className="relative z-0 hover:z-0 rounded-lg shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.22] overflow-hidden transition hover:scale-105">
              <div
                className="h-48 bg-gray-200 flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${lol})` }}
              ></div>
              <div className="mt-7 p-4 flex flex-col items-center text-center">
                <h3 className="font-medium text-2xl mb-2">
                  Tarjeta regalo de League of Legends
                </h3>
                <div className="grid grid-cols-2 gap-10 pt-8 pb-2">
                  <span className="text-brand-primary font-bold text-xl pt-1">
                    1300 pts
                  </span>
                  <button className="px-3 py-1 rounded-lg font-medium border-2 border-neutral-600 text-neutral-600 cursor-pointer transition hover:scale-110 bg-neutral-100">
                    Canjear
                  </button>
                </div>
              </div>
            </div>

            {/* Recompensa 5 */}
            <div className="relative z-0 hover:z-0 rounded-lg shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden transition hover:scale-105">
              <div
                className="h-48 bg-gray-200 flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${hm})` }}
              ></div>
              <div className="mt-7 p-4 flex flex-col items-center text-center">
                <h3 className="font-medium text-2xl mb-2">
                  H&M Tarjeta de Regalo España
                </h3>
                <div className="grid grid-cols-2 gap-10 pt-8 pb-2">
                  <span className="text-brand-primary font-bold text-xl pt-1">
                    2650 pts
                  </span>
                  <button className="px-3 py-1 rounded-lg font-medium border-2 border-neutral-600 text-neutral-600 cursor-pointer transition hover:scale-110 bg-neutral-100">
                    Canjear
                  </button>
                </div>
              </div>
            </div>

            {/* Recompensa 6 */}
            <div className="relative z-0 hover:z-0 rounded-lg shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.22] overflow-hidden transition hover:scale-105">
              <div
                className="h-48 bg-gray-200 flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${footlocker})` }}
              ></div>
              <div className="mt-7 p-4 flex flex-col items-center text-center">
                <h3 className="font-medium text-2xl mb-2">
                  FootLocker Tarjeta Regalo
                </h3>
                <div className="grid grid-cols-2 gap-10 pt-8 pb-2">
                  <span className="text-brand-primary font-bold text-xl pt-1">
                    1800 pts
                  </span>
                  <button className="px-3 py-1 rounded-lg font-medium border-2 border-neutral-600 text-neutral-600 cursor-pointer transition hover:scale-110 bg-neutral-100">
                    Canjear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}