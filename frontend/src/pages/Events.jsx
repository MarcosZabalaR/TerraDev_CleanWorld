import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import ZoneDrawer from "../components/ZoneDrawer";
import { IconChevronDown, IconChevronUp, IconCalendar, IconMapPin, IconAwardFilled, IconUser, IconZoomScan, IconCheck } from '@tabler/icons-react';

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('date-asc'); // date-asc = más cercano primero
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [registeringEventId, setRegisteringEventId] = useState(null);

  // Cargar usuario al montar el componente
  useEffect(() => {
    try {
      const userLocalString = localStorage.getItem('user');
      if (userLocalString) {
        const userData = JSON.parse(userLocalString);
        setCurrentUser(userData);
      }
    } catch (err) {
      console.error('Error loading user:', err);
    }
  }, []);

  // Cargar eventos cuando cambia el usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsRes, zonesRes] = await Promise.all([
          axios.get('http://localhost:8080/events'),
          axios.get('http://localhost:8080/zones')
        ]);

        // Marcar eventos donde el usuario está registrado
        const eventsWithRegistration = eventsRes.data.map(event => {
          const isUserRegistered = currentUser && event.attendees
            ? event.attendees.some(attendee => attendee.id === currentUser.id)
            : false;
          return { ...event, isUserRegistered };
        });

        setEvents(eventsWithRegistration);
        setZones(zonesRes.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const now = new Date();
  
  // Separar eventos pasados y futuros
  const upcomingEvents = events.filter(event => new Date(event.datetime) >= now);
  const pastEvents = events.filter(event => new Date(event.datetime) < now);
  
  // Ordenar eventos futuros
  const sortedUpcoming = [...upcomingEvents].sort((a, b) => {
    const dateA = new Date(a.datetime);
    const dateB = new Date(b.datetime);
    return sortOrder === 'date-asc' ? dateA - dateB : dateB - dateA;
  });
  
  // Ordenar eventos pasados (siempre del más reciente al más antiguo)
  const sortedPast = [...pastEvents].sort((a, b) => {
    const dateA = new Date(a.datetime);
    const dateB = new Date(b.datetime);
    return dateB - dateA; // Más reciente primero
  });
  
  // Combinar: eventos futuros + eventos pasados (si están habilitados)
  const sortedEvents = showPastEvents 
    ? [...sortedUpcoming, ...sortedPast]
    : sortedUpcoming;

  const filteredEvents = showMyEvents 
    ? sortedEvents.filter(event => event.isUserRegistered)
    : sortedEvents;

  const handleToggleSort = () => {
    setSortOrder(sortOrder === 'date-asc' ? 'date-desc' : 'date-asc');
  };

  const handleToggleMyEvents = () => {
    setShowMyEvents(!showMyEvents);
  };

  const handleTogglePastEvents = () => {
    setShowPastEvents(!showPastEvents);
  };

  const handleRegisterToEvent = async (eventId) => {
    if (!currentUser || !currentUser.id) {
      alert('Debes iniciar sesión para apuntarte a un evento');
      navigate('/login');
      return;
    }

    try {
      setRegisteringEventId(eventId);
      const response = await axios.post(
        `http://localhost:8080/events/${eventId}/attend`,
        { userId: currentUser.id },
        {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Actualizar el evento en la lista y marcar isUserRegistered
      setEvents(prevEvents =>
        prevEvents.map(e => {
          if (e.id === eventId) {
            const updatedAttendees = response.data.attendees || [];
            const isUserRegistered = updatedAttendees.some(u => u.id === currentUser.id);
            return { ...e, attendees: updatedAttendees, isUserRegistered };
          }
          return e;
        })
      );
    } catch (err) {
      console.error('Error registrando a evento:', err);
      if (err.response?.status === 401) {
        alert('Sesión expirada. Por favor inicia sesión de nuevo.');
        navigate('/login');
      } else if (err.response?.data?.message) {
        alert('Error: ' + err.response.data.message);
      } else {
        alert('Error al apuntarse al evento. Inténtalo de nuevo.');
      }
    } finally {
      setRegisteringEventId(null);
    }
  };

  const handleUnregisterFromEvent = async (eventId) => {
    if (!currentUser || !currentUser.id) {
      return;
    }

    try {
      setRegisteringEventId(eventId);
      const response = await axios.post(
        `http://localhost:8080/events/${eventId}/unattend`,
        { userId: currentUser.id },
        {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Actualizar el evento en la lista
      setEvents(prevEvents =>
        prevEvents.map(e => {
          if (e.id === eventId) {
            const updatedAttendees = response.data.attendees || [];
            const isUserRegistered = updatedAttendees.some(u => u.id === currentUser.id);
            return { ...e, attendees: updatedAttendees, isUserRegistered };
          }
          return e;
        })
      );
    } catch (err) {
      console.error('Error desapuntándose del evento:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      if (err.response?.status === 401) {
        alert('Sesión expirada. Por favor inicia sesión de nuevo.');
        navigate('/login');
      } else if (err.response?.data?.message) {
        alert('Error: ' + err.response.data.message);
      } else {
        alert('Error al desapuntarse del evento. Inténtalo de nuevo. Status: ' + (err.response?.status || 'desconocido'));
      }
    } finally {
      setRegisteringEventId(null);
    }
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntilEvent = (dateString) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffMs = eventDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Evento pasado';
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    return `En ${diffDays} días`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-brand-light">
        <section className="bg-brand-light py-7">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Eventos de Limpieza</h1>
            
            <div className="flex gap-4 flex-wrap items-start">
              {/* Botón de ordenación por fecha */}
              <div className="min-h-[68px]">
                <button 
                  onClick={handleToggleSort} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition shadow-md bg-brand-primary text-white hover:shadow-lg"
                >
                  Fecha del evento
                  {sortOrder === 'date-desc' ? <IconChevronDown size={20} /> : <IconChevronUp size={20} />}
                </button>
                <p className="text-sm text-gray-700 mt-1 font-medium">
                  {sortOrder === 'date-asc' ? 'Más cercanos primero' : 'Más lejanos primero'}
                </p>
              </div>

              {/* Botón de mis inscripciones */}
              <div className="min-h-[68px]">
                <button 
                  onClick={handleToggleMyEvents} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition shadow-md ${
                    showMyEvents 
                      ? 'bg-brand-primary text-white hover:shadow-lg' 
                      : 'bg-white text-gray-800 hover:bg-gray-50 hover:shadow-lg'
                  }`}
                >
                  <IconUser size={20} />
                  Mis inscripciones
                </button>
                {showMyEvents && (
                  <p className="text-sm text-gray-700 mt-1 font-medium">
                    Mostrando mis inscripciones
                  </p>
                )}
              </div>

              {/* Botón de eventos pasados */}
              <div className="min-h-[68px]">
                <button 
                  onClick={handleTogglePastEvents} 
                  className={`px-4 py-2 rounded-lg font-semibold transition shadow-md ${
                    showPastEvents 
                      ? 'bg-brand-primary text-white hover:shadow-lg' 
                      : 'bg-white text-gray-800 hover:bg-gray-50 hover:shadow-lg'
                  }`}
                >
                  {showPastEvents ? 'Ocultar eventos pasados' : 'Mostrar eventos pasados'}
                </button>
                {showPastEvents && (
                  <p className="text-sm text-gray-700 mt-1 font-medium">
                    Mostrando eventos pasados
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Cargando eventos...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No hay eventos disponibles</p>
            </div>
          )}

          {/* Grid de eventos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const isPastEvent = new Date(event.datetime) < now;
              const zone = event.zone || zones.find(z => z.id === event.zone_id);
              
              if (!zone) return null;
              
              return (
                <div
                  key={event.id}
                  className={`bg-white rounded-xl shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden transition transform hover:scale-105 cursor-pointer flex flex-col relative ${
                    isPastEvent ? 'opacity-60 border-4 border-emerald-400' : ''
                  }`}
                  onClick={() => {
                    if (zone) {
                      setSelectedZone(zone);
                      setSelectedEvent(event);
                    }
                  }}
                >
                  {/* Imagen de la zona */}
                  {zone.img_url && (
                    <div className="h-48 bg-gray-200 shrink-0 relative">
                      <img 
                        src={zone.img_url} 
                        alt={event.title} 
                        className="w-full h-full object-cover" 
                      />
                      
                      {/* Badge de completado (eventos pasados) */}
                      {isPastEvent && (
                        <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg border-2 border-white flex items-center gap-1">
                          <IconCheck size={16} />
                          Completado
                        </div>
                      )}
                      
                      {/* Badge de tiempo hasta el evento (solo futuros) */}
                      {!isPastEvent && (
                        <div className="absolute top-3 left-3 bg-sky-700 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg border-2 border-white">
                          {getTimeUntilEvent(event.datetime)}
                        </div>
                      )}

                      {/* Badge de recompensa */}
                      <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg border-2 border-white">
                        <IconAwardFilled size={16} />
                        +{event.reward_points} pts
                      </div>
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>

                    {event.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                    )}

                    {/* Información de la zona */}
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <IconMapPin size={16} />
                      <span className="line-clamp-1">{zone.title}</span>
                    </div>
                    
                    <div className="flex-1" />

                    {/* Fecha del evento */}
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <IconCalendar size={16} />
                      <span>{formatEventDate(event.datetime)}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between gap-2">
                        {!isPastEvent && (
                          <>
                            {event.isUserRegistered ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnregisterFromEvent(event.id);
                                }}
                                disabled={registeringEventId === event.id}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {registeringEventId === event.id ? 'Procesando...' : 'Desapuntarme'}
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRegisterToEvent(event.id);
                                }}
                                disabled={registeringEventId === event.id}
                                className="px-4 py-2 bg-sky-700 text-white rounded-lg font-semibold hover:bg-sky-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {registeringEventId === event.id ? 'Apuntando...' : 'Apuntarme'}
                              </button>
                            )}
                          </>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/map', {
                              state: {
                                selectedZoneId: zone.id,
                                zoomToZone: true,
                                coords: { lat: zone.latitude, lng: zone.longitude }
                              }
                            });
                          }}
                          className={`flex items-center gap-1 px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50 rounded-lg ${isPastEvent ? 'ml-auto' : ''}`}
                        >
                          <IconZoomScan size={16} />
                          Ver en mapa
                        </button>
                      </div>
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
          event={selectedEvent}
          onClose={() => {
            setSelectedZone(null);
            setSelectedEvent(null);
          }}
          onCreateEvent={() => {}}
        />
      )}
    </>
  );
}
