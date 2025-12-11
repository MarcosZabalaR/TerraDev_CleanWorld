import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

import envasesRaw from '../components/json/envases.json';
import vidrioRaw from '../components/json/vidrio.json';
import papelcartonRaw from '../components/json/papelcarton.json';
import aceiteRaw from '../components/json/aceite.json';
import pilasRaw from '../components/json/pilas.json';
import ropaRaw from '../components/json/ropa.json';
import residuosRaw from '../components/json/residuos.json';
import industriaRaw from '../components/json/industria.json';
import { convertGeoJSON } from '../components/json/convertGeoJSON.js';

import NavBar from '../components/NavBar.jsx';
import Mapa from '../components/Map.jsx';
import RecyclingMenu from '../components/RecyclingMenu.jsx';
import ReportModal from '../components/ReportModal.jsx';
import ZoneDrawer from '../components/ZoneDrawer.jsx';
import EventModal from '../components/EventModal.jsx';

export default function MapPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [reportCoords, setReportCoords] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedZoneForEvent, setSelectedZoneForEvent] = useState(null);
    const [pinPosition, setPinPosition] = useState({ x: 50, y: 35 });
    const [isRecyclingMenuOpen, setIsRecyclingMenuOpen] = useState(false);
    
    // Usar directamente searchParams como fuente de verdad
    const isReportMode = searchParams.get("report") === "true";

    // Desactivar filtros y cerrar menú cuando se activa el modo reporte
    useEffect(() => {
        if (isReportMode) {
            setTimeout(() => {
                setSelectedCategories([]);
                setIsRecyclingMenuOpen(false);
            }, 0);
        }
    }, [isReportMode]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get('http://localhost:8080/zones');
                const containers = [
                    { data: envasesRaw, category: 'envases' }, { data: vidrioRaw, category: 'vidrio' },
                    { data: papelcartonRaw, category: 'papel' }, { data: aceiteRaw, category: 'aceite' },
                    { data: pilasRaw, category: 'pilas' }, { data: ropaRaw, category: 'ropa' },
                    { data: residuosRaw, category: 'restos' }, { data: industriaRaw, category: 'industria' }
                ].flatMap(({ data: raw, category }) => 
                    convertGeoJSON(raw).features.map(f => ({
                        ...f, title: f.properties.tooltip || 'Zona sin título', residuo: category,
                        description: null, img_url: null, after_img_url: null, severity: 2,
                        status: 'SUCIO', reported_id: null, created_at: null
                    }))
                );
                setReports([...data, ...containers]);
            } catch (err) {
                console.error('Error cargando zonas:', err);
            }
        })();
    }, []);

    const handleMapClick = (latlng) => {
        if (isReportMode || reportCoords) {
            setReportCoords(latlng);
            isReportMode && setSearchParams({});
        }
    };

    const closeReport = () => {
        setReportCoords(null);
        setSearchParams({});
    };

    const handleSubmitReport = (report) => {
        // report ya viene con la respuesta del backend incluyendo el ID
        setReports(prev => [...prev, report]);
        closeReport();
    };

    const handleReportClick = (report) => {
        setSelectedReport(report);
    };

    const handleCloseDrawer = () => {
        setSelectedReport(null);
    };

    const handleOpenEventModal = (zone) => {
        setSelectedZoneForEvent(zone);
        setSelectedReport(null); // Cerrar drawer al abrir modal de evento
    };

    const handleCloseEventModal = () => {
        setSelectedZoneForEvent(null);
    };

    const handleSubmitEvent = (event) => {
        console.log('Evento creado:', event);
        // TODO: Enviar a backend
        handleCloseEventModal();
    };

    // Filtrar reports:
    // - Si NO hay categorías seleccionadas: solo mostrar reportes de usuario (sin residuo)
    // - Si HAY categorías: mostrar SOLO contenedores de esas categorías (sin reportes de usuario para evitar ruido visual)
    const filteredReports = selectedCategories.length > 0
        ? reports.filter(r => r.residuo && selectedCategories.includes(r.residuo))
        : reports.filter(r => !r.residuo); // Solo reportes de usuario cuando no hay filtros

    return (
        <div className="h-screen flex flex-col">
            <NavBar />
            <div className="flex-1 relative">
                <Mapa
                    onMapClick={handleMapClick}
                    reportCoords={reportCoords}
                    isReportMode={isReportMode}
                    reports={filteredReports}
                    onReportClick={handleReportClick}
                    onPinPositionUpdate={setPinPosition}
                />
                <RecyclingMenu
                    selected={selectedCategories}
                    onToggleCategory={setSelectedCategories}
                    disabled={isReportMode || reportCoords !== null}
                    isOpen={isRecyclingMenuOpen}
                    onToggleMenu={() => setIsRecyclingMenuOpen(!isRecyclingMenuOpen)}
                />
                <ReportModal
                    isReportMode={isReportMode}
                    reportCoords={reportCoords}
                    pinPosition={pinPosition}
                    onClose={closeReport}
                    onSubmit={handleSubmitReport}
                />
                <ZoneDrawer
                    report={selectedReport}
                    onClose={handleCloseDrawer}
                    onCreateEvent={handleOpenEventModal}
                />
                <EventModal
                    zone={selectedZoneForEvent}
                    onClose={handleCloseEventModal}
                    onSubmit={handleSubmitEvent}
                />
            </div>
        </div>
    );
}
