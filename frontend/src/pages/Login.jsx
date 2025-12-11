import Happy from "../assets/thx.jpg";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import Register from "./Register";

export default function Login() {
  const navigate = useNavigate();
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

            <form className="flex flex-col gap-5 md:gap-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder=" "
                  className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-light"
                />
                <label
                  className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm"
                >
                  Username
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="password"
                  placeholder=" "
                  className="peer bg-gray-100 border border-gray-300 rounded px-4 pt-5 pb-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-light"
                />
                <label
                  className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm"
                >
                  Password
                </label>
              </div>

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
                <a
                  href="#"
                  className="text-sm text-brand-primary hover:text-brand-dark hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-center p-4 md:p-0">
            <div className="relative w-full h-64 md:h-full">
              <img
                src={Happy}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
