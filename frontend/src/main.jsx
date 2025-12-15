import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { I18nextProvider } from "react-i18next";
import i18next from 'i18next';
import global_es from "./locales/es/global.json";
import global_en from "./locales/en/global.json";

// Detectar idioma del navegador y escoger los dos primeros caracteres
const browserLang = navigator.language.slice(0, 2);
console.log(navigator.language);

// Recuperar último idioma seleccionado si existe
const savedLang = localStorage.getItem("lang");
let defaultLang;

if (savedLang) {
  defaultLang = savedLang;
} else if (browserLang === "es" || browserLang === "en") {
  defaultLang = browserLang;
} else {
  defaultLang = "es";
}

i18next.init({
  interpolation: { escapeValue: false },
  lng: defaultLang,
  resources: {
    es: { global: global_es },
    en: { global: global_en },
  }
})

// Escuchar cambios de idioma y guardar en localStorage
i18next.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </StrictMode>,
)
