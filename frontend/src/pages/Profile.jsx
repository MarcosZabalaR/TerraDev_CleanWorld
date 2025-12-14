import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { logout } from "../utils/auth"; 

import { 
  IconCamera, IconUserCircle, IconMail, IconCalendar, IconLock, 
  IconPencil, IconX, IconLoader2, IconAlertCircle 
} from '@tabler/icons-react';

import DefaultAvatar from "../assets/Avatar.jpg";

const API_BASE_URL = import.meta.env.API_URL || "http://localhost:8080";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState(null);

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState(null);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarError, setAvatarError] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // --- FETCH CON AUTENTICACIÓN ---
  const fetchWithAuth = (url, options = {}) => {
    const userLocal = JSON.parse(localStorage.getItem('user')) || {};
    if (!userLocal?.token) throw new Error("Usuario no autenticado");

    const headers = {
      'Authorization': `Bearer ${userLocal.token}`,
      ...options.headers
    };

    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    } else if (!options.headers || !options.headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    return fetch(url, { ...options, headers });
  };

  // --- OBTENER DATOS DEL USUARIO ---
  useEffect(() => {
    const fetchUser = async () => {
      setError(null);
      setLoadingUser(true);
      try {
        const userLocalString = localStorage.getItem('user');
        if (!userLocalString) throw new Error("Usuario no autenticado");

        const usuarioLocal = JSON.parse(userLocalString);
        if (!usuarioLocal.id) throw new Error("ID de usuario no encontrado");

        const response = await fetchWithAuth(`${API_BASE_URL}/users/${usuarioLocal.id}`);
        
        if (!response.ok) {
          // Mostrar mensaje en lugar de logout inmediato
          if (response.status === 401 || response.status === 403) {
            setError("Sesión expirada. Por favor inicia sesión de nuevo.");
            return; // Salimos sin borrar localStorage
          }
          throw new Error("Error al cargar datos del usuario");
        }

        const data = await response.json();
        setUser({ ...data, id: usuarioLocal.id });
        setNewUsername(data.name);
      } catch (e) {
        console.error(e);
        setError(e.message || "Error al cargar perfil");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // --- FORMATEAR FECHA ---
  const formatJoinDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // --- SUBIR AVATAR ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setAvatarError("Archivo inválido (tipo o tamaño). Máx 5MB.");
      setAvatarFile(null);
      e.target.value = null;
      return;
    }

    setAvatarError(null);
    setAvatarFile(file);
    handleAvatarUpdate(file);
  };

  const handleAvatarUpdate = async (file) => {
    if (!file || !user?.id) return;

    setAvatarError(null);
    setIsUploadingAvatar(true);
    setLoadingAction(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetchWithAuth(`${API_BASE_URL}/users/${user.id}/avatar`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        if ([401, 403].includes(response.status)) {
          logout();
          throw new Error("Sesión expirada o permisos insuficientes.");
        }
        const errorText = await response.text();
        throw new Error(errorText || "Error al subir avatar");
      }

      const updatedData = await response.json();
      setUser(prev => ({ ...prev, avatar: updatedData.avatar }));
      const userLocal = JSON.parse(localStorage.getItem('user')) || {};
      localStorage.setItem("user", JSON.stringify({ ...userLocal, avatar: updatedData.avatar }));

      setAvatarFile(null);
    } catch (err) {
      console.error(err);
      setAvatarError(err.message);
    } finally {
      setIsUploadingAvatar(false);
      setLoadingAction(false);
    }
  };

  // --- CAMBIO DE NOMBRE ---
  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setUsernameError(null);

    if (!newUsername.trim() || newUsername.trim() === user.name) {
      setUsernameError("Nombre vacío o igual al actual");
      return;
    }
    if (!user?.id) return;

    setLoadingAction(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: newUsername.trim() }),
      });

      if (!response.ok) {
        if ([401, 403].includes(response.status)) { logout(); throw new Error("Sesión expirada"); }
        const errorText = await response.text();
        throw new Error(errorText || "Error al actualizar nombre");
      }

      const updatedData = response.status === 204 ? { name: newUsername.trim() } : await response.json();
      setUser(prev => ({ ...prev, name: updatedData.name }));
      const userLocal = JSON.parse(localStorage.getItem('user')) || {};
      localStorage.setItem("user", JSON.stringify({ ...userLocal, name: updatedData.name }));
      setIsEditingUsername(false);
    } catch (err) {
      console.error(err);
      setUsernameError(err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  // --- CAMBIO DE CONTRASEÑA ---
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmNewPassword) return setPasswordError("Contraseñas no coinciden");
    if (newPassword.length < 6) return setPasswordError("Mínimo 6 caracteres");

    if (!user?.id) return;
    setLoadingAction(true);

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users/${user.id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        if ([401, 403].includes(response.status)) { logout(); throw new Error("Sesión expirada"); }
        const errorText = await response.text();
        throw new Error(errorText || "Error al cambiar contraseña");
      }

      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error(err);
      setPasswordError(err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  // --- RENDERS ---
  if (loadingUser) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <IconLoader2 className="animate-spin text-brand-primary h-8 w-8 mr-2" />
        <p className="text-2xl text-gray-600">Cargando perfil...</p>
      </div>
      <Footer />
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <IconAlertCircle className="text-red-600 h-10 w-10 mb-4" />
        <p className="text-xl font-bold text-red-600 mb-2">Error de Carga</p>
        <p className="text-lg text-gray-700 max-w-md">{error}</p>
        <button onClick={() => window.location.href = '/login'} className="mt-6 px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition">Ir a Iniciar Sesión</button>
      </div>
      <Footer />
    </>
  );

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-brand-light h-20 flex items-end justify-center"></div>
          <div className="p-8 -mt-20">
            {/* AVATAR */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <img
                  key={user.avatar || "default"}
                  src={user.avatar ? user.avatar : DefaultAvatar}
                  alt="Avatar de Usuario"
                  className="rounded-full h-48 w-48 object-cover border-8 border-white shadow-xl"
                />
                <input type="file" id="avatar-upload" hidden accept="image/png, image/jpeg, image/webp" onChange={handleAvatarChange} disabled={isUploadingAvatar || loadingAction} />
                <label htmlFor="avatar-upload" className={`absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center transition duration-300 focus:outline-none cursor-pointer ${isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} ${isUploadingAvatar || loadingAction ? 'cursor-not-allowed' : ''}`}>
                  {isUploadingAvatar ? <IconLoader2 size={36} className="text-white animate-spin" /> : <IconCamera size={36} className="text-white" />}
                </label>
              </div>
            </div>
            {avatarError && <div className="flex items-center justify-center p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg max-w-sm mx-auto" role="alert"><IconAlertCircle size={18} className="mr-2" />{avatarError}</div>}

            {/* INFO USUARIO */}
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

              {/* Formularios de edición se mantendrían igual con usernameError y passwordError */}
              {/* Puedes reutilizar tu JSX actual de Username y Password Forms */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
