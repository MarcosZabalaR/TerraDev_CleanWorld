import WorldMap from "../assets/worldmap.webp";
import Cloud from "../assets/cloud.png";
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate()

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
              Start
            </button>
            <button 
              className="bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-xl hover:bg-gray-300 transition duration-300 z-999 cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>
        </div>

        <img
          src={WorldMap}
          className="h-220 w-220 spin absolute top-[50vh] z-10 select-none pointer-events-none"
        ></img>

        {/* DERECHA */}
        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[20vh] right-[-20vh] rotate-[-18deg] z-1 select-none pointer-events-none"
        ></img>

        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[35vh] right-[-54vh] rotate-[-18deg] z-1 select-none pointer-events-none"
        ></img>

        {/* IZQUIERDA */}
        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[25vh] left-[-50vh] rotate-16 z-1 select-none pointer-events-none"
        ></img>

        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[50vh] left-[-40vh] rotate-20 z-1 select-none pointer-events-none"
        ></img>
      </div>
    </>
  );
}

export default Home;
