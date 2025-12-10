/**
 * Sube una imagen a Cloudinary y retorna la URL permanente
 * @param {File} file - Archivo de imagen a subir
 * @returns {Promise<string>} URL segura de la imagen subida
 */
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Cloudinary error response:', data);
      throw new Error(data.error?.message || 'Error al subir la imagen');
    }
    
    console.log('Image uploaded successfully:', data.secure_url);
    return data.secure_url; // URL permanente de la imagen
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};
