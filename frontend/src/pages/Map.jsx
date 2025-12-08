import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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

export default function MapPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [reportCoords, setReportCoords] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    
    // Usar directamente searchParams como fuente de verdad
    const isReportMode = searchParams.get("report") === "true";

    // Cargar los reports solo una vez al montar
    useEffect(() => {
        const allRaw = [
            { data: envasesRaw, category: 'envases' },
            { data: vidrioRaw, category: 'vidrio' },
            { data: papelcartonRaw, category: 'papel' },
            { data: aceiteRaw, category: 'aceite' },
            { data: pilasRaw, category: 'pilas' },
            { data: ropaRaw, category: 'ropa' },
            { data: residuosRaw, category: 'restos' },
            { data: industriaRaw, category: 'industria' }
        ];

        const allFeatures = allRaw.flatMap(raw =>
            convertGeoJSON(raw.data).features.map(f => ({
                id: f.id,
                latitude: f.latitude,
                longitude: f.longitude,
                tooltip: f.properties.tooltip,
                residuo: raw.category,
                severity: f.properties.severity || 1
            }))
        );

        // Evitar warning de setState en efecto
        setTimeout(() => setReports(allFeatures), 0);

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
        setReports(prev => [...prev, report]);
        closeReport();
    };

    // Filtrar reports:
    // - Si NO hay categorías seleccionadas: solo mostrar reportes de usuario (sin residuo)
    // - Si HAY categorías: mostrar contenedores de esas categorías + todos los reportes de usuario
    const filteredReports = selectedCategories.length > 0
        ? reports.filter(r => !r.residuo || selectedCategories.includes(r.residuo))
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
                />
                <RecyclingMenu
                    selected={selectedCategories}
                    onToggleCategory={setSelectedCategories}
                />
                <ReportModal
                    isReportMode={isReportMode}
                    reportCoords={reportCoords}
                    onClose={closeReport}
                    onSubmit={handleSubmitReport}
                />
            </div>
        </div>
    );
}
