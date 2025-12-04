import { useState } from 'react';
import { IconX, IconPhoto } from '@tabler/icons-react';

const initialFormData = {
  title: '',
  description: '',
  img_url: '',
  severity: 3,
};

export default function ReportModal({ isReportMode, reportCoords, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: Date.now(),
      ...formData,
      latitude: reportCoords.lat,
      longitude: reportCoords.lng,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
    setFormData(initialFormData);
  };

  if (isReportMode && !reportCoords) {
    return (
      <div className="absolute bottom-2/8 left-1/2 -translate-x-1/2 z-1000 bg-brand-primary text-white px-4 py-2 rounded-lg shadow-lg">
        Haz clic en el mapa para marcar el punto
      </div>
    );
  }

  if (!reportCoords) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-1000 pointer-events-none">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96 pointer-events-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-brand-dark">Nuevo reporte</h3>
          <button onClick={onClose} className="p-1 hover:bg-brand-light/30 rounded-full cursor-pointer">
            <IconX size={24} className="text-brand-dark" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          📍 {reportCoords.lat.toFixed(5)}, {reportCoords.lng.toFixed(5)}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título *"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
          />

          <div>
            <label className="text-sm text-gray-700">
              Severidad: <strong>{formData.severity}</strong>
            </label>
            <input
              type="range"
              name="severity"
              min="1"
              max="5"
              value={formData.severity}
              onChange={handleChange}
              className="w-full accent-brand-primary"
            />
          </div>

          <div className="relative">
            <IconPhoto size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              name="img_url"
              value={formData.img_url}
              onChange={handleChange}
              placeholder="URL de imagen"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-brand-primary text-brand-dark rounded-lg hover:bg-brand-light/30 cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark cursor-pointer">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}