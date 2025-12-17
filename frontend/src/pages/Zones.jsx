import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import ZoneDrawer from "../components/ZoneDrawer";
import EventModal from "../components/EventModal";
import { IconChevronDown, IconChevronUp, IconAlertTriangle, IconCalendar, IconZoomScan, IconTrash } from '@tabler/icons-react';

export default function ZonesPage() {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('date-desc');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'SUCIO', 'LIMPIO'
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedZoneForEvent, setSelectedZoneForEvent] = useState(null);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const [zonesRes, eventsRes] = await Promise.all([
        axios.get('https://terradev-cleanworld.onrender.com/zones'),
        axios.get('https://terradev-cleanworld.onrender.com/events')
      ]);
      setZones(zonesRes.data);
      setEvents(eventsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEventModal = (zone) => {
    setSelectedZoneForEvent(zone);
    setSelectedZone(null);
  };

  const handleCloseEventModal = () => {
    setSelectedZoneForEvent(null);
  };

  const handleSubmitEvent = (event) => {
    setEvents(prev => [...prev, event]);
    handleCloseEventModal();
  };

  const handleDeleteZone = async (zoneId) => {
    try {
      await axios.delete(`https://terradev-cleanworld.onrender.com/zones/${zoneId}`);
      setZones(zones.filter(z => z.id !== zoneId));
    } catch (err) {
      console.error('Error borrando zona:', err);
      alert('Error al borrar la zona');
    }
  };

  const getSeverityValue = (s) => typeof s === 'number' ? s : ({ HIGH: 3, MEDIUM: 2, LOW: 1 }[s] || 0);
  
  const getSeverityColor = (s) => ['bg-gray-500', 'bg-brand-primary', 'bg-orange-500', 'bg-red-500'][getSeverityValue(s)] || 'bg-gray-500';
  
  const getSeverityText = (s) => ['', 'Leve', 'Moderada', 'Grave'][getSeverityValue(s)] || s;

  const filteredZones = statusFilter === 'all' ? zones : zones.filter(z => z.status === statusFilter);
  const sortedZones = [...filteredZones].sort((a, b) => 
    sortOrder.startsWith('date') ? (sortOrder === 'date-asc' ? 0 : -1) :
    getSeverityValue(sortOrder === 'severity-asc' ? a.severity : b.severity) - 
    getSeverityValue(sortOrder === 'severity-asc' ? b.severity : a.severity)
  );

  const filters = [
    { key: 'date', label: 'Fecha de creación', desc: { asc: 'Más antiguos primero', desc: 'Más recientes primero' } },
    { key: 'severity', label: 'Gravedad', desc: { asc: 'Menor gravedad primero', desc: 'Mayor gravedad primero' } }
  ];

  const statusLabels = { all: 'Todas las zonas', SUCIO: 'Zonas sucias', LIMPIO: 'Zonas limpias' };
  const statusDescriptions = { all: 'Mostrando todas las zonas', SUCIO: 'Mostrando zonas sucias', LIMPIO: 'Mostrando zonas limpias' };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-brand-light">
        <section className="bg-brand-light py-7">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Zonas Reportadas</h1>
            
            <div className="flex gap-4 flex-wrap items-start">
              {filters.map(({ key, label, desc }) => {
                const isActive = sortOrder.startsWith(key);
                const direction = sortOrder.split('-')[1];
                return (
                  <div key={key} className="h-[68px]">
                    <button onClick={() => setSortOrder(`${key}-${direction === 'desc' ? 'asc' : 'desc'}`)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition shadow-md min-w-[100px] ${isActive ? 'bg-brand-primary text-white hover:shadow-lg' : 'bg-white text-gray-800 hover:bg-gray-50 hover:shadow-lg'}`}>
                      {label}
                      <span className="w-5 h-5 flex items-center justify-center">
                        {isActive && (direction === 'desc' ? <IconChevronDown size={20} /> : <IconChevronUp size={20} />)}
                      </span>
                    </button>
                    <p className="text-sm text-gray-700 mt-1 font-medium h-5">
                      {isActive && desc[direction]}
                    </p>
                  </div>
                );
              })}
              
              <div className="h-[68px]">
                <button onClick={() => setStatusFilter({ all: 'SUCIO', SUCIO: 'LIMPIO', LIMPIO: 'all' }[statusFilter])} className={`w-[170px] px-4 py-2 rounded-lg font-semibold transition shadow-md ${statusFilter !== 'all' ? 'bg-brand-primary text-white hover:shadow-lg' : 'bg-white text-gray-800 hover:bg-gray-50 hover:shadow-lg'}`}>
                  {statusLabels[statusFilter]}
                </button>
                <p className="text-sm text-gray-700 mt-1 font-medium h-5">
                  {statusDescriptions[statusFilter]}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <div className="max-w-7xl mx-auto px-4 py-8">

          {loading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Cargando zonas...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && zones.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No hay zonas reportadas</p>
            </div>
          )}

          {/* Grid de zonas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedZones.map((zone) => {
              const createdDate = zone.created_at || zone.createdAt;
              const statusColors = { SUCIO: 'bg-red-100 text-red-800', LIMPIO: 'bg-green-100 text-green-800' };
              const hasEvent = events.some(e => e.zone?.id === zone.id || e.zone_id === zone.id);

              return (
                <div key={zone.id} className={`bg-white rounded-xl shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden transition transform hover:scale-105 cursor-pointer flex flex-col relative ${hasEvent ? 'ring-4 ring-sky-400' : ''}`} onClick={() => setSelectedZone(zone)}>
                  {(zone.status === 'LIMPIO' ? zone.after_img_url : zone.img_url) && (
                    <div className="h-48 bg-gray-200 shrink-0 relative">
                      <img src={zone.status === 'LIMPIO' ? zone.after_img_url : zone.img_url} alt={zone.title} className="w-full h-full object-cover" />
                      {hasEvent && (
                        <div className="absolute top-3 left-3 bg-sky-700 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg border-2 border-white">
                          <IconCalendar size={16} />
                          Evento creado
                        </div>
                      )}
                      {zone.status === 'LIMPIO' ? (
                        <div className="absolute top-3 right-3 bg-emerald-400 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg border-2 border-white">
                          ✓ Limpia
                        </div>
                      ) : (
                        <div className={`absolute top-3 right-3 ${getSeverityColor(zone.severity)} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg border-2 border-white`}>
                          <IconAlertTriangle size={16} />
                          {getSeverityText(zone.severity)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800 flex-1">{zone.title}</h3>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteZone(zone.id); }} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Borrar zona (DEV)">
                        <IconTrash size={18} />
                      </button>
                    </div>

                    {zone.description && <p className="text-gray-600 mb-3 line-clamp-2">{zone.description}</p>}
                    
                    <div className="flex-1" />

                    {createdDate && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                        <IconCalendar size={16} />
                        <span>Zona reportada el {new Date(createdDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[zone.status] || 'bg-yellow-100 text-yellow-800'}`}>
                        {zone.status}
                      </span>
                      
                      <button onClick={(e) => { e.stopPropagation(); navigate('/map', { state: { selectedZoneId: zone.id, zoomToZone: true, coords: { lat: zone.latitude, lng: zone.longitude } } }); }} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50 rounded-lg">
                        <IconZoomScan size={16} />
                        Ver en mapa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
      
      {selectedZone && (
        <ZoneDrawer
          report={selectedZone}
          event={events.find(e => e.zone?.id === selectedZone.id) || null}
          onClose={() => setSelectedZone(null)}
          onCreateEvent={handleOpenEventModal}
        />
      )}
      
      <EventModal
        zone={selectedZoneForEvent}
        onClose={handleCloseEventModal}
        onSubmit={handleSubmitEvent}
      />
    </>
  );
}