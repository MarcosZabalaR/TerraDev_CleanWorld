import Happy from "../assets/thx.jpg";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import axios from "axios";
import { useState } from "react";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";

// Importa el hook de Formspree si lo vas a usar, o usa axios directamente para Formspree
// Si usas Formspree, asegúrate de haber instalado: npm install @formspree/react
// Aquí usaré axios para la petición a Formspree, lo cual es más flexible.
// import { useForm } from "@formspree/react"; // Opcional, si prefieres usar el hook

export default function Login() {
  const navigate = useNavigate();
  // Asegúrate de que API_URL está correctamente configurada en .env y cargada por Vite/otro
  const baseURL = `${import.meta.env.VITE_API_URL || "https://terradev-cleanworld.onrender.com"}/users`;
  
  // =================================================================================
  // ESTADOS PRINCIPALES
  // =================================================================================
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // =================================================================================
  // ESTADOS PARA RECUPERACIÓN DE CONTRASEÑA
  // =================================================================================
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryStatus, setRecoveryStatus] = useState({ message: "", type: "" }); // type: 'success' | 'error' | ''
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
  
  // =================================================================================
  // HANDLERS DE LOGIN
  // =================================================================================
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!formValues.email.trim()) validationErrors.email = "El email es obligatorio";
    if (!formValues.password) validationErrors.password = "La contraseña es obligatoria";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await axios.post(`${baseURL}/login`, {
        email: formValues.email,
        password: formValues.password,
      });

      // response.data ya contiene id, name, email y token
      const userData = response.data;
      // Asumo que si tienes la foto, vendrá aquí (profilePicture)
      // Si no, la propiedad será undefined, lo cual es manejado en NavBar.jsx
      
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("Usuario logueado:", userData);

      navigate("/map"); // redirige al mapa

    } catch (error) {
      console.error("Error en login:", error);
      if (error.response?.status === 401) {
        setErrors({ login: "Email o contraseña incorrectos" });
      } else {
        setErrors({ login: "Error inesperado, inténtalo de nuevo" });
      }
    }
  };

  // =================================================================================
  // HANDLER DE RECUPERACIÓN DE CONTRASEÑA
  // =================================================================================
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setRecoveryStatus({ message: "", type: "" });
    
    if (!recoveryEmail.trim()) {
        setRecoveryStatus({ message: "Por favor, introduce tu correo electrónico.", type: "error" });
        return;
    }
    
    setIsRecoveryLoading(true);

    try {
        // PASO 1: Verificar si el correo existe en tu backend (asumo que tienes un endpoint)
        // Ejemplo de endpoint: /users/check-email-exists
        // **DEBES ASEGURARTE DE QUE ESTE ENDPOINT EXISTE EN TU BACKEND**
        const checkResponse = await axios.get(`${baseURL}/check-email-exists?email=${recoveryEmail}`);
        
        // Si el backend responde con un código 200/OK y dice que el email existe
        if (checkResponse.data.exists) {
            
            // PASO 2: Enviar el correo de recuperación usando Formspree
            // Necesitas configurar tu ID de Formspree (por ejemplo, 'fsw00000')
            const FORMSPREE_ID = "fsw000000000"; // <-- ¡REEMPLAZA CON TU ID DE FORMSPREE!
            
            // Aquí simulas que Formspree envía un enlace de recuperación
            const formspreeResponse = await axios.post(`https://formspree.io/f/${FORMSPREE_ID}`, {
                email: recoveryEmail,
                _subject: "Solicitud de Recuperación de Contraseña - CleanWorld",
                // Aquí deberías pasar la URL del enlace de restablecimiento (por ejemplo, con un token)
                // Esto es una simplificación, Formspree solo enviará el cuerpo del mensaje.
                // Idealmente, tu backend generaría un token y enviaría el correo.
                // **NOTA:** Usar Formspree aquí es una SIMPLIFICACIÓN. Para una recuperación real,
                // DEBES usar un servicio de email (SendGrid, nodemailer) y un token generado por tu backend.
                message: `Hola. Hemos recibido una solicitud de restablecimiento de contraseña para ${recoveryEmail}. Por favor, haz clic en el siguiente enlace para continuar: [LINK DE RESTABLECIMIENTO]`,
            }, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (formspreeResponse.status === 200) {
                setRecoveryStatus({ message: `Se ha enviado un correo a ${recoveryEmail}. Revisa tu bandeja de entrada y spam.`, type: "success" });
            } else {
                 setRecoveryStatus({ message: "Error al enviar el correo de Formspree. Inténtalo más tarde.", type: "error" });
            }

        } else {
            // Si el backend indica que el correo no existe, mostramos un mensaje genérico por seguridad
            setRecoveryStatus({ message: "Si la cuenta existe, recibirás un correo electrónico con instrucciones.", type: "success" });
        }
        
    } catch (error) {
        console.error("Error en el proceso de recuperación:", error);
        // Si el endpoint de check falla, o hay un error de red
        setRecoveryStatus({ message: "Error de conexión. Por favor, inténtalo más tarde.", type: "error" });
    } finally {
        setIsRecoveryLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-blue-50 to-brand-light">
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg p-8 md:p-10 w-11/12 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-1/4 h-1/2 w-px bg-gray-300/40"></div>

          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-800">
              Login
            </h1>

            <form className="flex flex-col gap-5 md:gap-6" onSubmit={handleSubmit}>
              {/* Campo Email */}
              <div className="relative w-full">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={formValues.email}
                  onChange={handleChange}
                  className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-light"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
                  peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                  peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
                  Email
                </label>
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Campo Password */}
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder=" "
                  value={formValues.password}
                  onChange={handleChange}
                  className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-brand-light"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <IconEyeClosed stroke={2} /> : <IconEye stroke={2} />}
                </button>

                <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
                  peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                  peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
                  Password
                </label>

                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              {errors.login && <p className="text-red-600 text-center">{errors.login}</p>}

              <div className="flex flex-col gap-3 md:gap-4">
                <button
                  type="submit"
                  className="bg-brand-primary text-white font-semibold py-3 rounded hover:bg-brand-dark transition duration-300"
                >
                  Login
                </button>

                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 font-semibold py-3 rounded hover:bg-gray-300 transition duration-300"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </div>

              <div className="text-center mt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowRecoveryModal(true);
                    setRecoveryStatus({ message: "", type: "" }); // Limpiar estado al abrir
                  }}
                  className="text-sm text-brand-primary hover:text-brand-dark hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-center p-4 md:p-0">
            <div className="relative w-full h-64 md:h-full">
              <img src={Happy} alt="Persona limpiando" className="rounded-lg object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* ================================================================================= */}
      {/* MODAL DE RECUPERACIÓN DE CONTRASEÑA */}
      {/* ================================================================================= */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Recuperar Contraseña</h2>
            
            <p className="mb-4 text-gray-600">
              Introduce el correo electrónico asociado a tu cuenta.
            </p>

            <form onSubmit={handleForgotPassword}>
              <div className="relative w-full mb-4">
                <input
                  type="email"
                  name="recoveryEmail"
                  placeholder=" "
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-light"
                  required
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
                  peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                  peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
                  Email
                </label>
              </div>

              {recoveryStatus.message && (
                <p className={`mb-4 text-center p-2 rounded ${recoveryStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {recoveryStatus.message}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRecoveryModal(false);
                    setRecoveryEmail(""); // Limpiar correo al cerrar
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                  disabled={isRecoveryLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-dark transition disabled:opacity-50"
                  disabled={isRecoveryLoading}
                >
                  {isRecoveryLoading ? "Enviando..." : "Enviar Correo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}