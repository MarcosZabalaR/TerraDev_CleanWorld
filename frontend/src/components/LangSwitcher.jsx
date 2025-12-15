import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import FlagES from "../../public/assets/flags/flag-es.svg";
import FlagEN from "../../public/assets/flags/flag-en.svg";

export default function LangSwitcher() {
  const { i18n } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const flags = {
    es: <img src={FlagES} alt="Español" className="w-5 h-5 hover:scale-110 transition-transform duration-200" />,
    en: <img src={FlagEN} alt="English" className="w-5 h-5 hover:scale-110 transition-transform duration-200" />,
  };

  const currentLang = i18n.language || "es";
  const availableLangs = Object.keys(flags).filter((l) => l !== currentLang);

  const handleChangeLang = (newLang) => {
    const currentPath = location.pathname;
  
    const routesCurrent =
      i18n.getResourceBundle(currentLang, "global")?.routes || {};
    const routesNew =
      i18n.getResourceBundle(newLang, "global")?.routes || {};
  
    const matchingKey = Object.keys(routesCurrent).find(
      (key) => routesCurrent[key] === currentPath
    );
  
    i18n.changeLanguage(newLang);
    setIsOpen(false);
  
    if (matchingKey && routesNew[matchingKey]) {
      navigate(routesNew[matchingKey], { replace: true });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-11 h-11 flex items-center justify-center rounded-xl shadow-card bg-white/0.1 backdrop-blur-xs border border-black/30 dark:border-white/20 transition-all duration-300"
      >
        {flags[currentLang]}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-11 rounded-xl shadow-card bg-white/0.1 backdrop-blur-xs border border-black/30 dark:border-white/20 transition-all duration-300 flex flex-col items-center py-2 z-50"
          >
            {availableLangs.map((lang) => (
              <button
                key={lang}
                onClick={() => handleChangeLang(lang)}
                className="w-8 h-8 flex items-center justify-center"
              >
                {flags[lang]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
