import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import ZoneDrawer from "../components/ZoneDrawer";
import { IconChevronDown, IconChevronUp, IconMapPin, IconAlertTriangle, IconCalendar } from '@tabler/icons-react';

export default function ZonesPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('date-desc');
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/zones');
      setZones(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching zones:', err);
      setError('Error al cargar las zonas');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityValue = (s) => typeof s === 'number' ? s : ({ HIGH: 3, MEDIUM: 2, LOW: 1 }[s] || 0);
  
  const getSeverityColor = (s) => ['bg-gray-500', 'bg-brand-primary', 'bg-orange-500', 'bg-red-500'][getSeverityValue(s)] || 'bg-gray-500';
  
  const getSeverityText = (s) => ['', 'Leve', 'Moderada', 'Grave'][getSeverityValue(s)] || s;

  const sortedZones = [...zones].sort((a, b) => {
    if (sortOrder.startsWith('date')) return sortOrder === 'date-asc' ? 0 : -1;
    return (getSeverityValue(sortOrder === 'severity-asc' ? a.severity : b.severity) - 
            getSeverityValue(sortOrder === 'severity-asc' ? b.severity : a.severity));
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-brand-light py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Zonas Reportadas</h1>
            
            {/* Controles de ordenamiento */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'date', label: 'Fecha de creación' },
                { key: 'severity', label: 'Gravedad' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortOrder(sortOrder === `${key}-desc` ? `${key}-asc` : `${key}-desc`)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                    sortOrder.startsWith(key) ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {label}
                  {sortOrder === `${key}-desc` ? <IconChevronDown size={20} /> : <IconChevronUp size={20} />}
                </button>
              ))}
            </div>
          </div>

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
            {sortedZones.map((zone) => (
              <div
                key={zone.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedZone(zone)}
              >
                {/* Imagen */}
                {zone.img_url && (
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img
                      src={zone.img_url}
                      alt={zone.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Contenido */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800 flex-1">{zone.title}</h3>
                    <div className={`${getSeverityColor(zone.severity)} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
                      <IconAlertTriangle size={16} />
                      {getSeverityText(zone.severity)}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">{zone.description}</p>

                  <div className="flex flex-col gap-2 text-gray-500 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <IconMapPin size={16} />
                      <span>{zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}</span>
                    </div>
                    
                    {zone.created_at && (
                      <div className="flex items-center gap-2">
                        <IconCalendar size={16} />
                        <span>{new Date(zone.created_at).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      zone.status === 'SUCIO' 
                        ? 'bg-red-100 text-red-800' 
                        : zone.status === 'LIMPIO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {zone.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      
      {selectedZone && (
        <ZoneDrawer
          report={selectedZone}
          onClose={() => setSelectedZone(null)}
          onCreateEvent={() => {}}
        />
      )}
    </>
  );
}