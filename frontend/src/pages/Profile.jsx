/*  - SALE INVALID DATE
    - AHORA MISMO ESTA PUESTA LA ID DE USUARIO A 1, debe de ser auto
  */




import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

// temporal
import Avatar from "../assets/Avatar.jpg";

export default function Profile() {
  // constantes
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // obtener el usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = 1; // HAY QUE CARGAR EL ID DEL USUARIO
        const response = await fetch(`http://localhost:8080/users/${userId}`);
        if (!response.ok) throw new Error("Error fetching user");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p>Cargando...</p>;
  return (
    <>
      <Navbar />
      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-brand-light">
        <div className="w-auto bg-white rounded-xl shadow-lg py-15 px-8 border-5  border-neutral-100">
          <h1 className="text-3xl md:text-6xl font-bold text-center mb-6 md:mb-8 text-gray-800">
            Profile Page
          </h1>

          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-4 text-xl mt-15 ml-10">
              <p className="border-l-4 border-brand-light mb-2 pl-2 font-semibold">
                Username: <span className="font-light px-4">{user.name}</span>
              </p>
              <p className="border-l-4 border-brand-light mb-2 pl-2 font-semibold">
                Email:{" "}
                <span className="font-light px-4">{user.email}</span>
              </p>
              <p className="border-l-4 border-brand-light mb-2 pl-2 font-semibold">
                Member since:{" "}
                <span className="font-light px-4">{new Date(user.created_at).toLocaleDateString()}</span>
              </p>
              <p className="border-l-4 border-brand-light mb-2 pl-2 font-semibold">
                Password:{" "}
                <span className="font-light px-4">
                  <span className="border-b-2 border-brand-primary text-brand-primary cursor-pointer inline-block transition-transform hover:scale-105">
                    Change password
                  </span>
                </span>
              </p>
              <p className="border-l-4 border-brand-light mb-2 pl-2 font-semibold">
                Avatar:{" "}
                <span className="font-light px-4">
                  <span className="border-b-2 border-brand-primary text-brand-primary cursor-pointer inline-block transition-transform hover:scale-105">
                    Change profile picture
                  </span>
                </span>
              </p>
            </div>
            <div className="grid grid-cols-1">
              <img
                src={Avatar}
                className="rounded-full ml-22 mt-14 h-60 w-60"
              ></img>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
