import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";

export default function Register() {
  const navigate = useNavigate();
  const baseURL = `${import.meta.env.API_URL || "https://terradev-cleanworld.onrender.com"}/users`;

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    rol: 1,
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules = {
    length: formValues.password.length >= 10,
    lowercase: /[a-z]/.test(formValues.password),
    uppercase: /[A-Z]/.test(formValues.password),
    number: /\d/.test(formValues.password),
    special: /[^A-Za-z0-9]/.test(formValues.password),
    match:
      formValues.password &&
      confirmPassword &&
      formValues.password === confirmPassword,
  };

  const passwordStrength = Object.values(passwordRules).filter(Boolean).length;

  const isFormValid =
    formValues.name.trim() &&
    formValues.email.trim() &&
    Object.values(passwordRules).every(Boolean);

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formValues.name.trim()) validationErrors.name = "El nombre es obligatorio";
    if (!formValues.email.trim()) validationErrors.email = "El email es obligatorio";
    if (!Object.values(passwordRules).every(Boolean))
      validationErrors.password = "La contraseña no cumple los requisitos";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await axios.post(baseURL, {
        ...formValues,
        avatar: "",
        points: 1000,
      });
      navigate("/login");
    } catch {
      setErrors({ submit: "Error inesperado al crear usuario" });
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-brand-light">
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg p-8 md:p-10 w-full max-w-3xl">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Registro
          </h1>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* USUARIO */}
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
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-sm">
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
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-sm">
                Email *
              </label>
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>

            {/* PASSWORD & CONFIRM PASSWORD */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-2/3 space-y-4">
                {/* PASSWORD */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder=" "
                    value={formValues.password}
                    onChange={handleChange}
                    className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full pr-12 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all
                    peer-placeholder-shown:top-5 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-sm">
                    Contraseña *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-4 text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? <IconEyeClosed stroke={2} /> : <IconEye stroke={2} />}
                  </button>
                </div>

                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className={`h-2 rounded transition-all ${
                      passwordStrength <= 2
                        ? "bg-red-500 w-1/4"
                        : passwordStrength <= 4
                        ? "bg-yellow-400 w-3/4"
                        : "bg-green-600 w-full"
                    }`}
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder=" "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full pr-12 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all
                    peer-placeholder-shown:top-5 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-sm">
                    Confirmar contraseña *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-4 text-gray-600 hover:text-gray-800"
                  >
                    {showConfirmPassword  ? <IconEyeClosed stroke={2} /> : <IconEye stroke={2} />}
                  </button>
                </div>
              </div>

              {/* RULES */}
              <div className="w-full md:w-1/3 bg-gray-50 border rounded-lg p-3 text-sm">
                <p className="font-semibold mb-2">Debe contener:</p>
                <ul className="space-y-1">
                  {Object.entries({
                    "10 caracteres mínimo": passwordRules.length,
                    "Una minúscula": passwordRules.lowercase,
                    "Una mayúscula": passwordRules.uppercase,
                    "Un número": passwordRules.number,
                    "Un carácter especial": passwordRules.special,
                    "Las contraseñas coinciden": passwordRules.match,
                  }).map(([label, valid]) => (
                    <li
                      key={label}
                      className={valid ? "text-green-600 line-through" : "text-gray-600"}
                    >
                      • {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {errors.submit && (
              <p className="text-red-600 text-center">{errors.submit}</p>
            )}

            <button
              type="submit"
              disabled={!isFormValid}
              className={`py-3 rounded font-semibold transition ${
                isFormValid
                  ? "bg-brand-primary text-white hover:bg-brand-dark"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Registrar
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="py-3 rounded bg-gray-200 hover:bg-gray-300"
            >
              Ya tengo cuenta
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
