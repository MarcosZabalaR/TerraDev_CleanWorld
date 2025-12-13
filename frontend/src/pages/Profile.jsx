import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

// Iconos
import { IconCamera, IconUserCircle, IconMail, IconCalendar, IconLock, IconPencil, IconX, IconLoader2, IconAlertCircle } from '@tabler/icons-react';

// Imagen temporal por defecto si no hay avatar
import DefaultAvatar from "../assets/Avatar.jpg";

// URL base de la API
const API_BASE_URL = "http://localhost:8080";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Cambio de Nombre ---
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState(null);

  // --- Cambio de Contraseña ---
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  // --- Helper fetch con JWT ---
  const fetchWithAuth = (url, options = {}) => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario?.token) throw new Error("Usuario no autenticado");
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${usuario.token}`,
        'Content-Type': 'application/json'
      }
    });
  };

  // Función para simular cambio de avatar
  const handleAvatarChange = () => {
    alert("Funcionalidad para cambiar la foto de perfil (simulado).");
  };

  // Actualizar nombre de usuario
  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setUsernameError(null);
    if (!newUsername.trim() || newUsername.trim() === user.name) {
      setUsernameError("El nombre de usuario no puede estar vacío y debe ser diferente al actual.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: newUsername.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el nombre de usuario.");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditingUsername(false);
      alert("Nombre de usuario actualizado con éxito.");

    } catch (err) {
      console.error("Error al actualizar el nombre de usuario:", err);
      setUsernameError(err.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar contraseña
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cambiar la contraseña.");
      }

      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      alert("Contraseña cambiada con éxito.");

    } catch (err) {
      console.error("Error al cambiar la contraseña:", err);
      setPasswordError(err.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Obtener datos del usuario al cargar
  useEffect(() => {
    const fetchUser = async () => {
      setError(null);
      setLoading(true);
      try {
        const usuario = JSON.parse(localStorage.getItem('user'));
        if (!usuario?.token) throw new Error("Usuario no autenticado");

        const response = await fetchWithAuth(`${API_BASE_URL}/users/${usuario.id}`);
        if (!response.ok) throw new Error("Error fetching user data.");

        const data = await response.json();
        setUser(data);
        setNewUsername(data.name);

      } catch (e) {
        console.error("Error fetching user:", e);
        setError("No se pudo cargar el perfil del usuario.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading && !user) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <IconLoader2 className="animate-spin text-brand-primary h-8 w-8 mr-2" />
        <p className="text-2xl text-gray-600">Cargando perfil...</p>
      </div>
      <Footer />
    </>
  );

  if (error && !user) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen text-center">
        <IconAlertCircle className="text-red-600 h-8 w-8 mr-2" />
        <p className="text-xl text-red-600">{error}</p>
      </div>
      <Footer />
    </>
  );

  if (!user) return null;

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="bg-brand-light h-20 flex items-end justify-center"></div>
          <div className="p-8 -mt-20">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <img
                  src={user.avatar ?? DefaultAvatar}
                  alt="Avatar de Usuario"
                  className="rounded-full h-48 w-48 object-cover border-8 border-white shadow-xl"
                />
                <button
                  onClick={handleAvatarChange}
                  className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 focus:outline-none"
                  aria-label="Cambiar foto de perfil"
                >
                  <IconCamera size={36} className="text-white" />
                </button>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-2">{user.name}</h1>
            <p className="text-center text-xl text-brand-primary mb-12">Miembro de CleanWorld</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow-sm">
                <IconMail size={24} className="text-brand-primary mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-green-50 rounded-lg shadow-sm">
                <IconCalendar size={24} className="text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Miembro desde</p>
                  <p className="text-lg font-semibold text-gray-800">{formatJoinDate(user.createdAt)}</p>
                </div>
              </div>

              {/* Edición de nombre */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center p-4 bg-yellow-50 rounded-lg shadow-sm">
                  <IconUserCircle size={24} className="text-yellow-600 mr-3 shrink-0" />
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-500">Nombre de Usuario</p>
                    <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                  </div>
                  {!isEditingUsername && (
                    <button 
                      onClick={() => { setIsEditingUsername(true); setIsChangingPassword(false); setUsernameError(null); }}
                      className="ml-4 p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                      aria-label="Editar nombre de usuario"
                      disabled={loading}
                    >
                      <IconPencil size={20} />
                    </button>
                  )}
                </div>

                {isEditingUsername && (
                  <form onSubmit={handleUsernameUpdate} className="mt-4 p-4 bg-white border border-yellow-300 rounded-lg shadow-lg">
                    <h3 className="text-lg font-bold mb-3 text-gray-700">Cambiar Nombre de Usuario</h3>
                    {usernameError && (
                      <div className="flex items-center p-3 mb-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        <IconAlertCircle size={18} className="mr-2" />
                        {usernameError}
                      </div>
                    )}
                    <div className="mb-3">
                      <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700">Nuevo Nombre de Usuario</label>
                      <input
                        id="newUsername"
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button type="button" onClick={() => setIsEditingUsername(false)} className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" disabled={loading}><IconX size={18} className="mr-1" />Cancelar</button>
                      <button type="submit" className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark transition duration-150 disabled:opacity-50">{loading ? <IconLoader2 size={20} className="animate-spin mr-1" /> : 'Guardar'}</button>
                    </div>
                  </form>
                )}
              </div>

              {/* Seguridad */}
              <div className="col-span-1 md:col-span-2 mt-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Seguridad</h2>
                {!isChangingPassword && (
                  <button onClick={() => { setIsChangingPassword(true); setIsEditingUsername(false); setPasswordError(null); }} className="flex justify-between items-center w-full px-6 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition duration-150" disabled={loading}>
                    Cambiar Contraseña <span className="text-lg">&rarr;</span>
                  </button>
                )}
                {isChangingPassword && (
                  <form onSubmit={handlePasswordUpdate} className="mt-4 p-4 bg-white border border-red-300 rounded-lg shadow-lg">
                    <h3 className="text-lg font-bold mb-3 text-gray-700">Formulario de Contraseña</h3>
                    {passwordError && <div className="flex items-center p-3 mb-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert"><IconAlertCircle size={18} className="mr-2" />{passwordError}</div>}
                    <div className="mb-3"><label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Contraseña Actual</label><input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required disabled={loading}/></div>
                    <div className="mb-3"><label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label><input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required disabled={loading}/></div>
                    <div className="mb-4"><label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label><input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required disabled={loading}/></div>
                    <div className="flex justify-end space-x-3">
                      <button type="button" onClick={() => setIsChangingPassword(false)} className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" disabled={loading}><IconX size={18} className="mr-1" />Cancelar</button>
                      <button type="submit" className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition duration-150 disabled:opacity-50">{loading ? <IconLoader2 size={20} className="animate-spin mr-1" /> : <IconLock size={18} className="mr-1" />}Actualizar Contraseña</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
