import WorldMap from "../assets/worldmap.webp";
import Cloud from "../assets/cloud.png";
import Footer from "../components/Footer";
import Register from "./Register"
import Login from "./Login";
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <>
      <div className="bg-gradient-to-r from-blue-200 to-blue-100 h-[100vh] flex justify-center relative overflow-hidden ">
        <div className="text-white mt-20">
          <span className="text-2xl font-medium drop-shadow-[1px_1px_0px_gray]">
            Welcome to
          </span>
          <h1 className="text-9xl font-bold drop-shadow-[1px_3px_1px_gray] z-60">
            CleanWorld
          </h1>

          <div className="flex justify-center mt-5">
            <button
              className="border-3 border-neutral-400 px-3 py-2 bg-neutral-100 rounded-full mr-5 text-neutral-700 hover:scale-105 transition cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
            <button className="border-3 border-gray-400 px-3 py-2 bg-neutral-500 rounded-full hover:scale-105 transition cursor-pointer z-999"
            onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        </div>

        <img
          src={WorldMap}
          className="h-220 w-220 spin absolute top-[50vh] z-10"
        ></img>

        {/* DERECHA */}
        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[20vh] right-[-20vh] rotate-[-18deg] z-1"
        ></img>

        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[35vh] right-[-54vh] rotate-[-18deg] z-1"
        ></img>

        {/* IZQUIERDA */}
        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[25vh] left-[-50vh] rotate-[16deg] z-1"
        ></img>

        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[50vh] left-[-40vh] rotate-[20deg] z-1"
        ></img>
      </div>
	  <Footer />
    </>
  );
}

export default Home;
