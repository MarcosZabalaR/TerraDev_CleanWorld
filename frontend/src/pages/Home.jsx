import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import WorldMap from "../assets/worldmap.webp";
import Cloud from "../assets/cloud.png";

function Home() {
  const { t } = useTranslation("global");
  const navigate = useNavigate();

  const [isLoggedIn] = useState(() => {
    try {
      return !!localStorage.getItem("user");
    } catch {
      return false;
    }
  });

  return (
    <div className="bg-linear-to-b from-blue-50 to-neutral-100 h-screen flex justify-center relative overflow-hidden">
      <div className="text-white mt-20">
        <span className="text-2xl font-medium drop-shadow-[1px_1px_0px_gray] text-brand-dark select-none pointer-events-none">
          {t("home.welcome")}
        </span>

        <h1 className="text-6xl md:text-9xl font-bold drop-shadow-[1px_3px_1px_gray] select-none pointer-events-none">
          <span className="text-brand-light z-9999">Clean</span>
          <span className="text-brand-primary z-9999">World</span>
        </h1>

        <div className="flex justify-center gap-4 mt-5">
          <button
            className="bg-brand-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-dark transition duration-300 shadow-lg hover:shadow-xl z-9999"
            onClick={() => navigate("/map")}
          >
            {t("home.map")}
          </button>

          {!isLoggedIn && (
            <button
              className="bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-xl hover:bg-gray-300 transition duration-300 z-9999"
              onClick={() => navigate("/login")}
            >
              {t("home.login")}
            </button>
          )}
        </div>
      </div>

      <img
        src={WorldMap}
        className="h-90 md:h-220 w-220 spin absolute top-[70vh] md:top-[50vh] z-10 select-none pointer-events-none"
        alt="Mapa Mundial"
      />

      <img src={Cloud} className="sm:hidden scale-150 absolute top-[50vh] right-[-20vh] " />
      <img src={Cloud} className="sm:hidden scale-150 absolute top-[60vh] right-[20vh] rotate-[35deg]" />
      
      {<img src={Cloud} className="xs:hidden md:h-100 md:w-400 absolute top-[65vh] md:top-[35vh] right-[-10vh] md:right-[-54vh] rotate-[-18deg]" />}
      <img src={Cloud} className="xs:hidden md:h-100 md:w-400 absolute top-[60vh] md:top-[60vh] right-[-10vh] md:right-[-54vh]" />
      <img src={Cloud} className="xs:hidden md:h-100 md:w-400 absolute top-[60vh] left-[-20vh] md:left-[-40vh] rotate-20" /> 
    </div>
  );
}

      

export default Home;