import { useState } from 'react';
import { IconX, IconCamera, IconCheck, IconMapPin } from '@tabler/icons-react';

const initialFormData = {
  title: '',
  description: '',
  severity: 2,
};

const severityOptions = [
  { 
    value: 1, 
    label: 'Leve', 
    description: 'Basura dispersa por la zona',
    bgColor: 'bg-brand-primary/10',
    borderColor: 'border-brand-primary',
    dotColor: 'bg-brand-primary',
    hoverBorder: 'hover:border-brand-primary/70'
  },
  { 
    value: 2, 
    label: 'Moderado', 
    description: 'Acumulación notable de basura',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-500',
    dotColor: 'bg-orange-500',
    hoverBorder: 'hover:border-orange-400'
  },
  { 
    value: 3, 
    label: 'Grave', 
    description: 'Vertido ilegal o gran acumulación de basura',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    dotColor: 'bg-red-500',
    hoverBorder: 'hover:border-red-400'
  }
];

export default function ReportModal({ isReportMode, reportCoords, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'severity' ? parseInt(value, 10) : value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (images.length >= 1) return alert('Máximo 1 imagen');

    const reader = new FileReader();
    reader.onloadend = () => setImages([{ file, preview: reader.result }]);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setImages([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: `user-report-${Date.now()}`,
      ...formData,
      images: images.map(img => img.file),
      latitude: reportCoords.lat,
      longitude: reportCoords.lng,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
    resetForm();
  };

  // Mostrar indicación si está en modo reporte pero no hay coordenadas
  if (isReportMode && !reportCoords) {
    return (
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-9999 bg-white px-6 py-4 rounded-xl shadow-2xl border-2 border-brand-primary">
        <div className="flex items-center gap-3 text-brand-dark">
          <div className="bg-brand-primary/10 p-2 rounded-lg">
            <IconMapPin size={24} className="text-brand-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-base">Selecciona la ubicación</p>
            <p className="text-sm text-gray-600">Haz clic en el mapa para marcar la zona</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors p-2 rounded-lg"
            type="button"
          >
            <IconX size={20} />
          </button>
        </div>
      </div>
    );
  }

  // No renderizar modal si no hay coordenadas
  if (!reportCoords) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center bg-black/30 pointer-events-none">
      <div 
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col relative z-10000 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-brand-dark">
              Reportar zona
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <IconMapPin size={14} />
                <span className="font-mono text-xs">
                  {reportCoords.lat.toFixed(5)}, {reportCoords.lng.toFixed(5)}
                </span>
              </div>
              <span className="text-xs text-brand-primary font-medium">
                📍 Haz clic en el mapa para cambiar ubicación
              </span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); onClose(); }}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors p-2 rounded-lg"
            type="button"
          >
            <IconX size={24} />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="overflow-y-auto p-6 space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej: Basura acumulada junto al contenedor"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all text-base"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe el problema con detalle..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all resize-none text-base"
              />
            </div>

            {/* Severidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Nivel de gravedad
              </label>
              <div className="grid grid-cols-3 gap-2">
                {severityOptions.map(option => (
                  <label
                    key={option.value}
                    className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.severity === option.value
                        ? `${option.borderColor} ${option.bgColor} shadow-md`
                        : `border-gray-200 ${option.hoverBorder} hover:bg-gray-50`
                    }`}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={option.value}
                      checked={formData.severity === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 mb-2 flex items-center justify-center shrink-0 ${
                      formData.severity === option.value
                        ? `${option.borderColor} ${option.dotColor}`
                        : 'border-gray-300 bg-white'
                    }`}>
                      {formData.severity === option.value && (
                        <IconCheck className="w-4 h-4 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Fotos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fotografía <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              
              {images.length > 0 ? (
                <div className="relative group w-full aspect-video mb-3">
                  <img
                    src={images[0].preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-brand-primary hover:bg-brand-light/10 transition-all group">
                  <div className="bg-brand-light/20 p-3 rounded-full mb-2 group-hover:bg-brand-light/30 transition-colors">
                    <IconCamera className="w-8 h-8 text-brand-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-primary transition-colors">Añadir fotografía</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG (máx. 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="p-5 border-t border-gray-200 bg-gray-50 shrink-0 flex gap-3">
            <button
              type="button"
              onClick={() => { resetForm(); onClose(); }}
              className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Enviar reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}