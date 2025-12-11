// src/pages/Error404.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-9xl font-bold text-brand-dark select-none pointer-events-none">404</h1>
      <p className="text-2xl font-medium text-gray-600 mb-4 select-none pointer-events-none">Página No Encontrada</p>
      <div className='grid grid-cols-2 gap-1 text-center select-none'>
        <Link to="/" className="p-3 bg-brand-primary text-white rounded-lg hover:bg-brand-light hover:text-brand-dark transition">
            Volver a Inicio
        </Link>
        <Link to="/contacto" className="p-3 border border-brand-primary bg-neutral-200 text-brand-primary rounded-lg hover:bg-brand-light hover:text-brand-dark transition">
            Contactar con soporte
        </Link>
      </div>
    </div>
  );
};

export default Error404;
