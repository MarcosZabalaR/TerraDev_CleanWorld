import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const baseURL = `${import.meta.env.API_URL || "http://localhost:8080"}/users`;

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    // Validación nombre
    if (!formValues.name.trim()) {
      validationErrors.name = "El nombre de usuario es obligatorio";
    } else {
      const patternUser = /^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑüÜ'-]+$/;
      if (!patternUser.test(formValues.name)) {
        validationErrors.name = "El usuario solo puede tener letras y números";
      }
    }

    // Validación email
    if (!formValues.email.trim()) {
      validationErrors.email = "El email es obligatorio";
    } else {
      const patternEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!patternEmail.test(formValues.email)) {
        validationErrors.email = "Formato de email inválido";
      }
    }

    // Validación contraseña
    if (!formValues.password) {
      validationErrors.password = "La contraseña es obligatoria";
    }
    if (formValues.password !== confirmPassword) {
      validationErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(validationErrors);

    // Si hay errores, no seguimos
    if (Object.keys(validationErrors).length > 0) return;

    try {
      // POST al backend
      const response = await axios.post(baseURL, {
        ...formValues,
        avatar: "",  // puedes dejar vacío o manejarlo después
        points: 0,
      });

      console.log("Usuario creado:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Error creando usuario:", error);
      if (error.response?.status === 409) {
        setErrors({ name: "El usuario ya existe" });
      } else {
        alert("Error al crear el usuario, revisa la consola.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-brand-light">
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg p-8 md:p-10 w-120 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-800">
            Registro
          </h1>

          <form className="flex flex-col gap-5 md:gap-6" onSubmit={handleSubmit}>

            {/* NOMBRE */}
            <div className="relative w-full">
              <input
                type="text"
                name="name"
                placeholder=" "
                value={formValues.name}
                onChange={handleChange}
                className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
                Usuario *
              </label>
              {errors.name && <p className="text-red-600">{errors.name}</p>}
            </div>

            {/* EMAIL */}
            <div className="relative w-full">
              <input
                type="email"
                name="email"
                placeholder=" "
                value={formValues.email}
                onChange={handleChange}
                className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
                Email *
              </label>
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div className="relative w-full">
              <input
                type="password"
                name="password"
                placeholder=" "
                value={formValues.password}
                onChange={handleChange}
                className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
                Contraseña *
              </label>
              {errors.password && <p className="text-red-600">{errors.password}</p>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative w-full">
              <input
                type="password"
                name="confirmPassword"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
                Confirmar contraseña *
              </label>
              {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* BOTONES */}
            <div className="flex flex-col gap-3 md:gap-4">
              <button type="submit" className="bg-brand-primary text-white font-semibold py-3 rounded hover:bg-brand-dark transition duration-300">
                Registrar
              </button>
              <button type="button" className="bg-gray-200 text-gray-800 font-semibold py-3 rounded hover:bg-gray-300 transition duration-300" onClick={() => navigate("/login")}>
                Ya tengo cuenta
              </button>
            </div>

          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
