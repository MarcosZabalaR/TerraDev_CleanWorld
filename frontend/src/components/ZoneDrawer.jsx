import { IconX, IconCalendarPlus, IconMapPin, IconNavigation, IconAlertTriangle, IconAlertCircle, IconTrash } from '@tabler/icons-react';

const severityConfig = {
  LOW: { 
    label: 'Leve', 
    color: 'text-brand-primary', 
    bgColor: 'bg-brand-primary/10',
    borderColor: 'border-brand-primary/30',
    dotColor: 'bg-brand-primary'
  },
  MEDIUM: { 
    label: 'Moderado', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    dotColor: 'bg-orange-500'
  },
  HIGH: { 
    label: 'Grave', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    dotColor: 'bg-red-500'
  }
};

const statusConfig = {
  SUCIO: {
    label: 'Sucio',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
    dotColor: 'bg-yellow-500',
    animated: true
  },
  LIMPIO: {
    label: 'Limpio',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    dotColor: 'bg-green-500',
    animated: false
  }
};

export default function ZoneDrawer({ report, onClose, onCreateEvent }) {
  if (!report) return null;

  // Convertir severity numérico a string si es necesario
  const severityKey = typeof report.severity === 'number' 
    ? ['', 'LOW', 'MEDIUM', 'HIGH'][report.severity] 
    : report.severity;
  
  const severity = severityConfig[severityKey] || severityConfig.MEDIUM;
  const status = statusConfig[report.status] || statusConfig.SUCIO;
  
  const formattedDate = report.created_at 
    ? new Date(report.created_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Fecha no disponible';

  const handleCreateEvent = () => {
    onCreateEvent?.(report);
  };

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${report.latitude},${report.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Overlay semitransparente */}
      <div 
        className="fixed inset-0 bg-black/20 z-9998 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer desde la derecha */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-9999 transform transition-transform duration-300 ease-out flex flex-col">
        
        {/* Header */}
        <div className="bg-linear-to-r from-brand-primary to-brand-dark text-white p-5 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold leading-tight">{report.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 transition-colors p-2 rounded-lg shrink-0"
            >
              <IconX size={24} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-white/90">
            <IconMapPin size={16} />
            <span className="font-mono">
              {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
            </span>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Imagen principal */}
          {report.img_url && (
            <div className="relative rounded-2xl overflow-hidden  border-2 border-gray-200">
              <img
                src={report.img_url}
                alt={report.title}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          {/* Badge de gravedad - Destacado */}
          <div className={`relative overflow-hidden rounded-xl border-2 ${severity.borderColor} `}>
            <div className={`absolute inset-0 ${severity.bgColor} opacity-90`} />
            <div className="relative flex items-center gap-3 p-4">
              <div className={`p-2 rounded-lg ${severity.color} bg-white/90`}>
                {severityKey === 'HIGH' ? (
                  <IconAlertTriangle size={28} strokeWidth={2.5} />
                ) : severityKey === 'MEDIUM' ? (
                  <IconAlertCircle size={28} strokeWidth={2.5} />
                ) : (
                  <IconTrash size={28} strokeWidth={2.5} />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-lg font-bold ${severity.color} mb-0.5`}>{severity.label}</p>
                <p className="text-xs font-medium text-gray-600">
                  {severityKey === 'HIGH' 
                    ? 'Requiere atención inmediata' 
                    : severityKey === 'MEDIUM' 
                    ? 'Necesita limpieza pronto' 
                    : 'Basura dispersa en la zona'}
                </p>
              </div>
              <div className={`w-1.5 h-12 rounded-full ${severity.dotColor}`} />
            </div>
          </div>

          {/* Imagen "después" (si existe y está limpio) */}
          {report.after_img_url && report.status === 'LIMPIO' && (
            <div className="relative rounded-2xl overflow-hidden  border-2 border-green-300">
              <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold ">
                ✓ Después de la limpieza
              </div>
              <img
                src={report.after_img_url}
                alt={`${report.title} - después`}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          {/* Descripción */}
          {report.description && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Descripción
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
                {report.description}
              </p>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Estado</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.bgColor} ${status.color} border ${status.borderColor}`}>
                <div className={`w-2 h-2 rounded-full ${status.dotColor} ${status.animated ? 'animate-pulse' : ''}`} />
                {status.label}
              </span>
            </div>
            
            {report.created_at && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">Fecha de reporte</span>
                <span className="text-sm text-gray-700 font-mono">{formattedDate}</span>
              </div>
            )}

            {report.reported_id && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">Reportado por</span>
                <span className="text-sm text-gray-700">Usuario #{report.reported_id}</span>
              </div>
            )}
          </div>

        </div>

        {/* Footer - Botones de acción */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 shrink-0 flex gap-3">
          <button
            onClick={handleNavigate}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl cursor-pointer"
          >
            <IconNavigation size={20} />
            Llévame allí
          </button>
          
          <button
            onClick={handleCreateEvent}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-brand-primary hover:bg-brand-dark text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl cursor-pointer"
          >
            <IconCalendarPlus size={20} />
            Crear Evento
          </button>
        </div>

      </div>
    </>
  );
}
