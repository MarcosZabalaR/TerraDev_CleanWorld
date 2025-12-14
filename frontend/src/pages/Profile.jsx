import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

// 🎯 Asegúrate de que tu función 'logout' ahora limpia solo la clave 'user'
// Si estás usando una librería o un archivo auth.js, debe hacer: localStorage.removeItem('user');
import { logout } from "../utils/auth"; 

// Iconos
import { IconCamera, IconUserCircle, IconMail, IconCalendar, IconLock, IconPencil, IconX, IconLoader2, IconAlertCircle } from '@tabler/icons-react';

// Imagen temporal por defecto si no hay avatar
import DefaultAvatar from "../assets/Avatar.jpg";

// URL base de la API
const API_BASE_URL = import.meta.env.API_URL || "http://localhost:8080";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
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

  // --- LÓGICA PARA CAMBIO DE AVATAR ---
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarError, setAvatarError] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);


  /**
   * Helper para realizar peticiones con el Token JWT de autenticación.
   * 🎯 MODIFICADO: Lee el token del objeto 'user' completo.
   * @param {string} url - URL de la API.
   * @param {object} options - Opciones de fetch (method, body, headers, etc.).
   * @returns {Promise<Response>}
   */
  const fetchWithAuth = (url, options = {}) => {
    const userString = localStorage.getItem('user');
    
    if (!userString) throw new Error("Usuario no autenticado");

    let usuario;
    try {
      usuario = JSON.parse(userString);
    } catch (e) {
      throw new Error("Datos de usuario corruptos en localStorage");
    }

    if (!usuario?.token) throw new Error("Token de autenticación no encontrado");

    // Lógica para manejar Content-Type para JSON vs FormData (archivos)
    const headers = {
        'Authorization': `Bearer ${usuario.token}`, // Usa el token del objeto
        ...options.headers, 
    };
    
    // Si el body es un FormData, eliminamos Content-Type para que el navegador lo establezca correctamente
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    } else if (!options.headers || !options.headers['Content-Type']) {
        // Aseguramos JSON por defecto si no es FormData ni tiene Content-Type ya
        headers['Content-Type'] = 'application/json';
    }

    return fetch(url, {
      ...options,
      headers: headers,
    });
  };

  /**
   * Función que maneja la selección y subida del archivo de avatar.
   */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validación básica
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
          setAvatarError("Archivo inválido (tipo o tamaño). El límite es 5MB.");
          setAvatarFile(null);
          e.target.value = null; 
          return;
      }
      setAvatarError(null);
      setAvatarFile(file);
      // Inicia la subida inmediatamente
      handleAvatarUpdate(file); 
    }
  };

  /**
   * Función para subir y actualizar la foto de perfil.
   */
  const handleAvatarUpdate = async (file) => {
    if (!file) return;

    setAvatarError(null);
    setIsUploadingAvatar(true);
    setLoading(true); 
    
    if (!user?.id) {
        setAvatarError("ID de usuario no disponible para actualizar.");
        setLoading(false);
        setIsUploadingAvatar(false);
        return;
    }


    try {
      const formData = new FormData();
      formData.append('avatar', file); 

      // ENDPOINT DE CAMBIO DE AVATAR (PATCH)
      const response = await fetchWithAuth(`${API_BASE_URL}/users/${user.id}/avatar`, {
        method: 'PATCH', 
        body: formData,
      });

      if (!response.ok) {
        // Si hay un 401/403, limpiar local storage y forzar error
        if (response.status === 401 || response.status === 403) {
            logout(); // Usa la función logout que limpia la clave 'user'
            throw new Error("Sesión expirada o permisos insuficientes. Por favor, inicia sesión de nuevo.");
        }
        
        const errorText = await response.text();
        let errorMessage = "Error al subir la foto de perfil.";
        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            errorMessage = errorText || `Error ${response.status}: Respuesta del servidor inválida.`;
        }
        throw new Error(errorMessage);
      }

      const updatedUserData = await response.json(); 
      
      // Actualizar estados (solo el avatar)
      setUser(prevUser => ({ ...prevUser, avatar: updatedUserData.avatar }));
      
      // 🎯 ACTUALIZAR EL OBJETO COMPLETO EN LOCAL STORAGE
      const userLocal = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem("user", JSON.stringify({ ...userLocal, avatar: updatedUserData.avatar }));
      
      setAvatarFile(null);
      alert("Foto de perfil actualizada con éxito.");

    } catch (err) {
      console.error("Error al actualizar el avatar:", err);
      setAvatarError(err.message || "No se pudo subir el archivo.");
      if (err.message.includes("Sesión expirada")) {
          window.location.reload(); 
      }
    } finally {
      setIsUploadingAvatar(false);
      setLoading(false);
    }
  };


  /**
   * Función para actualizar nombre de usuario.
   */
  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setUsernameError(null);
    if (!newUsername.trim() || newUsername.trim() === user.name) {
      setUsernameError("El nombre de usuario no puede estar vacío y debe ser diferente al actual.");
      return;
    }
    setLoading(true);
    
    if (!user?.id) {
        setUsernameError("ID de usuario no disponible para actualizar.");
        setLoading(false);
        return;
    }

    try {
      // ENDPOINT DE CAMBIO DE NOMBRE (PATCH al recurso principal)
      const response = await fetchWithAuth(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: newUsername.trim() }),
      });

      if (!response.ok) {
        // Si hay un 401/403, limpiar local storage y forzar error
        if (response.status === 401 || response.status === 403) {
            logout(); 
            throw new Error("Sesión expirada o permisos insuficientes. Por favor, inicia sesión de nuevo.");
        }
        
        const errorText = await response.text(); 
        let errorMessage = "Error al actualizar el nombre de usuario.";
        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            errorMessage = errorText || `Error ${response.status}: Respuesta del servidor inválida.`;
        }
        throw new Error(errorMessage);
      }

      let updatedUserData;
      if (response.status !== 204) {
        updatedUserData = await response.json();
      } else {
        updatedUserData = { name: newUsername.trim() }; 
      }
      
      // Actualizar estados
      setUser(prevUser => ({ ...prevUser, name: updatedUserData.name }));
      
      // 🎯 ACTUALIZAR EL OBJETO COMPLETO EN LOCAL STORAGE
      const userLocal = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem("user", JSON.stringify({ ...userLocal, name: updatedUserData.name }));
      
      setIsEditingUsername(false);
      alert("Nombre de usuario actualizado con éxito.");

    } catch (err) {
      console.error("Error al actualizar el nombre de usuario:", err);
      setUsernameError(err.message || "No se pudo conectar con el servidor o token inválido.");
      if (err.message.includes("Sesión expirada")) {
          window.location.reload(); 
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para actualizar contraseña.
   */
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
    
    if (!user?.id) {
        setPasswordError("ID de usuario no disponible para actualizar.");
        setLoading(false);
        return;
    }
    
    try {
      // ENDPOINT DE CAMBIO DE CONTRASEÑA (PATCH a un sub-recurso dedicado)
      const response = await fetchWithAuth(`${API_BASE_URL}/users/${user.id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      if (!response.ok) {
        // Si hay un 401/403, limpiar local storage y forzar error
        if (response.status === 401 || response.status === 403) {
            logout(); 
            throw new Error("Sesión expirada o permisos insuficientes. Por favor, inicia sesión de nuevo.");
        }
        
        const errorText = await response.text();  
        let errorMessage = "Error al cambiar la contraseña. Verifica la contraseña actual.";
        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage; 
        } catch (e) {
            errorMessage = errorText || `Error ${response.status}.`;
        }
        throw new Error(errorMessage);
      }
      
      // Limpieza y éxito
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      alert("Contraseña cambiada con éxito. Por seguridad, es posible que deba volver a iniciar sesión.");

    } catch (err) {
      console.error("Error al cambiar la contraseña:", err);
      setPasswordError(err.message || "No se pudo conectar con el servidor.");
       if (err.message.includes("Sesión expirada")) {
          window.location.reload(); 
      }
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
        // 🎯 OBTENER el objeto COMPLETO de 'user'
        const userLocalString = localStorage.getItem('user');
        if (!userLocalString) throw new Error("Usuario no autenticado. Redirigiendo a Login.");

        const usuarioLocal = JSON.parse(userLocalString);
        if (!usuarioLocal.id) throw new Error("ID de usuario no encontrado en la sesión.");

        // ENDPOINT DE OBTENCIÓN DE DATOS (GET)
        const response = await fetchWithAuth(`${API_BASE_URL}/users/${usuarioLocal.id}`);
        
        if (!response.ok) {
           // Manejo explícito de token inválido/expirado en el GET inicial
           if (response.status === 401 || response.status === 403) {
              logout(); // Limpia la sesión y fuerza el re-login
              throw new Error("Sesión expirada o token inválido. Por favor, inicia sesión de nuevo.");
           }
           throw new Error("Error al obtener los datos del usuario.");
        }

        const data = await response.json();
        // 🎯 Aseguramos que el estado de React use la ID para las peticiones posteriores
        setUser({ ...data, id: usuarioLocal.id });
        setNewUsername(data.name); 
        
      } catch (e) {
        console.error("Error fetching user:", e);
        setError(e.message || "No se pudo cargar el perfil del usuario.");
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
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <IconAlertCircle className="text-red-600 h-10 w-10 mb-4" />
        <p className="text-xl font-bold text-red-600 mb-2">Error de Carga</p>
        <p className="text-lg text-gray-700 max-w-md">{error}</p>
        {(error.includes("Sesión expirada") || error.includes("Usuario no autenticado")) && (
            <button 
                onClick={() => window.location.href = '/login'} 
                className="mt-6 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition"
            >
                Ir a Iniciar Sesión
            </button>
        )}
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
                  key={user.avatar} 
                  src={user.avatar || DefaultAvatar} 
                  alt="Avatar de Usuario"
                  className="rounded-full h-48 w-48 object-cover border-8 border-white shadow-xl"
                />
                
                <input
                    type="file"
                    id="avatar-upload"
                    hidden
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleAvatarChange}
                    disabled={isUploadingAvatar || loading}
                />
                
                <label 
                  htmlFor="avatar-upload"
                  className={`absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center transition duration-300 focus:outline-none cursor-pointer 
                    ${isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                    ${(isUploadingAvatar || loading) ? 'cursor-not-allowed' : ''}
                  `}
                  aria-label="Cambiar foto de perfil"
                  // Deshabilitar la acción de clic si está cargando o subiendo
                  onClick={(e) => { if (isUploadingAvatar || loading) e.preventDefault(); }}
                >
                  {isUploadingAvatar ? (
                    <IconLoader2 size={36} className="text-white animate-spin" />
                  ) : (
                    <IconCamera size={36} className="text-white" />
                  )}
                </label>
              </div>
            </div>
            
            {/* Mensaje de error de avatar */}
            {avatarError && (
                <div className="flex items-center justify-center p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg max-w-sm mx-auto" role="alert">
                    <IconAlertCircle size={18} className="mr-2" />
                    {avatarError}
                </div>
            )}


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
                      onClick={() => { setIsEditingUsername(true); setIsChangingPassword(false); setUsernameError(null); setNewUsername(user.name); }}
                      className="ml-4 p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                      aria-label="Editar nombre de usuario"
                      disabled={loading || isUploadingAvatar}
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
                        disabled={loading || isUploadingAvatar}
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button type="button" onClick={() => setIsEditingUsername(false)} className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" disabled={loading || isUploadingAvatar}><IconX size={18} className="mr-1" />Cancelar</button>
                      <button type="submit" className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark transition duration-150 disabled:opacity-50">{loading ? <IconLoader2 size={20} className="animate-spin mr-1" /> : 'Guardar'}</button>
                    </div>
                  </form>
                )}
              </div>

              {/* Seguridad */}
              <div className="col-span-1 md:col-span-2 mt-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Seguridad</h2>
                {!isChangingPassword && (
                  <button onClick={() => { setIsChangingPassword(true); setIsEditingUsername(false); setPasswordError(null); }} className="flex justify-between items-center w-full px-6 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition duration-150" disabled={loading || isUploadingAvatar}>
                    Cambiar Contraseña <span className="text-lg">→</span>
                  </button>
                )}
                {isChangingPassword && (
                  <form onSubmit={handlePasswordUpdate} className="mt-4 p-4 bg-white border border-red-300 rounded-lg shadow-lg">
                    <h3 className="text-lg font-bold mb-3 text-gray-700">Formulario de Contraseña</h3>
                    {passwordError && <div className="flex items-center p-3 mb-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert"><IconAlertCircle size={18} className="mr-2" />{passwordError}</div>}
                    <div className="mb-3"><label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Contraseña Actual</label><input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required disabled={loading || isUploadingAvatar}/></div>
                    <div className="mb-3"><label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label><input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required disabled={loading || isUploadingAvatar}/></div>
                    <div className="mb-4"><label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label><input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" required disabled={loading || isUploadingAvatar}/></div>
                    <div className="flex justify-end space-x-3">
                      <button type="button" onClick={() => setIsChangingPassword(false)} className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" disabled={loading || isUploadingAvatar}><IconX size={18} className="mr-1" />Cancelar</button>
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