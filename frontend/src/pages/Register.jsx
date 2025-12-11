import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const baseURL = "http://localhost:8080/users";

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    points: 0,
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const createUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(baseURL, formValues);

      console.log("Usuario creado:", response.data);

      navigate("/login");
    } catch (error) {
      console.error("Error creando usuario:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-[#AFBF75]">
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg p-8 md:p-10 w-120 max-w-2xl">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-800">
              Register
            </h1>

            <form className="flex flex-col gap-5 md:gap-6" onSubmit={createUser}>
              
              {/* USERNAME */}
              <div className="relative w-full">
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full 
                           focus:outline-none focus:ring-2 focus:ring-[#AFBF75]"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
                  Username
                </label>
              </div>

              {/* EMAIL */}
              <div className="relative w-full">
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full 
                           focus:outline-none focus:ring-2 focus:ring-[#AFBF75]"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
                  Email
                </label>
              </div>

              {/* PASSWORD */}
              <div className="relative w-full">
                <input
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full 
                           focus:outline-none focus:ring-2 focus:ring-[#AFBF75]"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm">
                  Password
                </label>
              </div>

              {/* BOTONES */}
              <div className="flex flex-col gap-3 md:gap-4">
                <button
                  type="submit"
                  className="bg-[#5F7336] text-white font-semibold py-3 rounded hover:bg-[#324016] transition duration-300"
                >
                  Register
                </button>

                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 font-semibold py-3 rounded hover:bg-gray-300 transition duration-300"
                  onClick={() => navigate("/login")}
                >
                  Already have an account?
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
