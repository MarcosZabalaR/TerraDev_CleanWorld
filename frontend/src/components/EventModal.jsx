import { useState } from 'react';
import axios from 'axios';
import { IconX, IconCalendar, IconTrophy, IconMapPin, IconCalendarPlus } from '@tabler/icons-react';

const severityPointsMap = {
  1: 10, LOW: 10,
  2: 25, MEDIUM: 25,
  3: 50, HIGH: 50
};

const suggestedTools = [
  { id: 'gloves', key: 'gloves' },
  { id: 'bags', key: 'bags' },
  { id: 'picker', key: 'picker' },
  { id: 'broom', key: 'broom' },
  { id: 'shovel', key: 'shovel' },
  { id: 'rake', key: 'rake' },
  { id: 'vest', key: 'vest' },
  { id: 'water', key: 'water' },
];

const initialFormData = {
  title: '',
  description: '',
  datetime: '',
};

export default function EventModal({ zone, onClose, onSubmit, t }) {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedTools, setSelectedTools] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [minDateTime] = useState(() => 
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  
  const rewardPoints = severityPointsMap[zone?.severity] || 25;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToolToggle = (toolId) => {
    setSelectedTools(prev => {
      const newTools = prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId];
      
      const toolsList = newTools
        .map(id => suggestedTools.find(t => t.id === id)?.key)
        .filter(Boolean)
        .map(key => t[key]);
      
      const toolsText = toolsList.length > 0
        ? `\n\n🛠️ ${t.tools}:\n${toolsList.map(t => `• ${t}`).join('\n')}`
        : '';
      
      const baseDescription = formData.description.split('\n\n🛠️')[0];
      setFormData(prev => ({
        ...prev,
        description: baseDescription + toolsText
      }));
      
      return newTools;
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedTools([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedDate = new Date(formData.datetime);
    const now = new Date();
    const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    if (selectedDate < minDate) {
      alert(t.eventAlert);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data } = await axios.post('http://localhost:8080/events', {
        title: formData.title,
        description: formData.description,
        datetime: formData.datetime,
        status: 'SCHEDULED',
        reward_points: rewardPoints,
        zone: { id: zone.id }
      });
      
      onSubmit?.(data);
      resetForm();
      onClose();
    } catch (error) {
      console.error(t.errorEvent, error);
      alert(error.response?.data?.message || t.errorEvent);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!zone) return null;

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center pointer-events-none" style={{ zIndex: 10000 }}>
      <div 
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
        style={{ zIndex: 10000 }}
      />
      
      <div 
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col relative pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 10001 }}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex-1">
            <h2 className="flex gap-2 text-2xl font-bold text-brand-dark">
              <IconCalendarPlus size={20} />
              {t.organize}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <IconMapPin size={14} />
                <span className="font-medium text-xs truncate max-w-[200px]">
                  {zone.title}
                </span>
              </div>
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

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="overflow-y-auto p-6 space-y-6">
            
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.titleEvent} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ej: Limpieza Parque Central"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all text-base"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.description} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe las actividades del evento..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all resize-none text-base"
              />
            </div>

            {/* Herramientas sugeridas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.toolsNecesary}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {suggestedTools.map(tool => (
                  <label
                    key={tool.id}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                    style={{
                      borderColor: selectedTools.includes(tool.id) ? '#5F7336' : '#e5e7eb',
                      backgroundColor: selectedTools.includes(tool.id) ? '#f0f4e8' : 'white'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTools.includes(tool.id)}
                      onChange={() => handleToolToggle(tool.id)}
                      className="w-3.5 h-3.5 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                    />
                    <span className="text-xs text-gray-700">{t[tool.key]}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1.5">{t.toolsAdd}</p>
            </div>

            {/* Fecha y Hora */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.dateTime} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  name="datetime"
                  value={formData.datetime}
                  onChange={handleChange}
                  required
                  min={minDateTime}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all text-base"
                />
                <IconCalendar 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              <p className="text-xs text-gray-600 mt-1.5">{t.eventAlert}</p>
            </div>

            {/* Puntos de recompensa */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.pointsEeward}</label>
              <div className="relative">
                <div className="w-full px-4 py-3 pl-11 border-2 border-brand-primary/30 bg-brand-light/20 rounded-xl text-base font-bold text-brand-dark">
                  {rewardPoints} {t.points}
                </div>
                <IconTrophy 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none"
                />
              </div>
              <p className="text-xs text-gray-600 mt-1.5">
                {t.autoPoints} ({['', t.mild, t.moderate, t.severe][typeof zone.severity === 'number' ? zone.severity : ({ LOW: 1, MEDIUM: 2, HIGH: 3 }[zone.severity] || 2)]})
              </p>
            </div>

            {/* Info de la zona */}
            <div className="bg-brand-light/20 rounded-xl p-4 border border-brand-primary/20">
              <h3 className="text-sm font-bold text-brand-dark mb-3 flex items-center gap-2">
                <IconMapPin size={16} />
                {t.selectZone}
              </h3>
              {zone.img_url && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <img 
                    src={zone.img_url} 
                    alt={zone.title}
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
              <p className="text-sm text-gray-700 font-medium">{zone.title}</p>
              {zone.description && (
                <p className="text-xs text-gray-600 mt-1">{zone.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span className="font-mono">
                  {zone.latitude.toFixed(5)}, {zone.longitude.toFixed(5)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-200 bg-gray-50 shrink-0 flex gap-3">
            <button
              type="button"
              onClick={() => { resetForm(); onClose(); }}
              disabled={isSubmitting}
              className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-5 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t.creating : t.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
