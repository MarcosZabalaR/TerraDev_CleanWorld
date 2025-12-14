// src/utils/auth.js (o donde lo almacenes)

/**
 * Verifica si el usuario está logueado comprobando la existencia y validez del token.
 * NOTA: Asume que el token se guarda con la clave 'token'.
 * Si el token es un JWT, intenta decodificarlo para verificar la expiración.
 * @returns {boolean} True si el usuario está logueado y el token es válido.
 */
export const isLoggedIn = () => {
  // Ahora solo buscamos 'token' en lugar de 'user'
  const token = localStorage.getItem("token");
  if (!token) return false;

  // Opcional: Decodificación para comprobar expiración (Si usas JWT)
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false; // No es un JWT válido
      
    // Decodificación base64 (parte 1 del JWT)
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp; // timestamp en segundos
      
    // Retorna true si el tiempo actual es menor que el tiempo de expiración
    return Date.now() < exp * 1000;
  } catch (e) {
    // Si falla la decodificación, el token es corrupto
    return false;
  }
};

/**
 * Cierra la sesión eliminando el token.
 */
export const logout = () => {
  localStorage.removeItem("token");
  // Opcional: eliminar el nombre de usuario si lo guardaste aparte
  localStorage.removeItem("userName"); 
  window.location.href = '/'; // Redirigir al inicio después de cerrar sesión
};


/**
 * Obtiene el nombre del usuario directamente del localStorage.
 * NOTA: Asume que el nombre está guardado bajo la clave 'userName'.
 */
export const getUserName = () => {
    return localStorage.getItem("userName") || "Usuario";
};