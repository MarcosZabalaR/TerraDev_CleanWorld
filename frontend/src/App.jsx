import "./App.css";
import WorldMap from "./assets/worldmap.webp";

function App() {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-200 to-blue-100 h-[100vh] flex justify-center relative overflow-hidden">
        <div className="text-white mt-20">
          <span className="text-2xl font-medium drop-shadow-[1px_1px_0px_gray]">
            Welcome to
          </span>
          <h1 className="text-9xl font-bold drop-shadow-[1px_3px_1px_gray]">
            CleanWorld
          </h1>
          
          <div className="flex justify-center mt-5">
            <button className="border-3 border-neutral-400 px-3 py-2 bg-neutral-100 rounded-full mr-5 text-neutral-700 hover:scale-105 transition cursor-pointer">Sign In</button>
            <button className="border-3 border-gray-400 px-3 py-2 bg-neutral-500 rounded-full hover:scale-105 transition cursor-pointer">Register</button>
          </div>
        </div>

        <img
          src={WorldMap}
          className="h-220 w-220 spin absolute top-[50vh] z-10"
        ></img>
      </div>
    </>
  );
}

export default App;
