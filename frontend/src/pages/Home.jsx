import WorldMap from "../assets/worldmapGR.png";
import Cloud from "../assets/cloud.png";
import { useNavigate } from 'react-router-dom'
import PageTitle from "../components/PageTitle";

function Home() {
  const navigate = useNavigate()

  return (
    <>
      <PageTitle title={"Inicio"} />

      <div className="bg-gradient-to-b from-blue-50 to-neutral-100 h-[100vh] flex justify-center relative overflow-hidden ">
        <div className="text-white mt-20">
          <span className="text-2xl font-medium drop-shadow-[1px_1px_0px_gray] text-neutral-700 select-none pointer-events-none">
            Bienvenido a
          </span>
          <h1 className="text-9xl font-bold drop-shadow-[1px_3px_1px_gray] z-60 select-none pointer-events-none">
            <span className="text-[#AFBF75]">Clean</span><span className="text-[#5f7336]">World</span>
          </h1>

          <div className="flex justify-center mt-5">
            <button
              className="border-3 border-neutral-400 px-3 py-2 bg-neutral-100 rounded-full mr-5 text-neutral-700 hover:scale-105 transition cursor-pointer z-999 select-none"
              onClick={() => navigate('/map')}
            >
              Start
            </button>
            <button className="border-3 border-gray-400 px-3 py-2 bg-neutral-400 rounded-full hover:scale-105 transition cursor-pointer z-999 select-none"
            onClick={() => navigate('/login')}>
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
          className="h-100 w-400 absolute top-[25vh] left-[-50vh] rotate-[16deg] z-1 select-none pointer-events-none"
        ></img>

        <img
          src={Cloud}
          className="h-100 w-400 absolute top-[50vh] left-[-40vh] rotate-[20deg] z-1 select-none pointer-events-none"
        ></img>
      </div>
    </>
  );
}

export default Home;
