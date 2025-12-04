import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import NavBar from '../components/NavBar.jsx';
import Mapa from '../components/Map.jsx';
import RecyclingMenu from '../components/RecyclingMenu.jsx';
import ReportModal from '../components/ReportModal.jsx';

export default function MapaPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [reportCoords, setReportCoords] = useState(null);
    const [reports, setReports] = useState([]);

    const isReportMode = searchParams.get("report") === "true";

    const handleMapClick = (latlng) => {
        if (isReportMode) {
            setReportCoords(latlng);
            setSearchParams({});
        }
    };

    const handleCloseReport = () => {
        setReportCoords(null);
    };

    const handleSubmitReport = (report) => {
        setReports(prev => [...prev, report]);
        setReportCoords(null);
    };

    return (
        <div className="h-screen flex flex-col">
            <NavBar />
            <div className="flex-1 relative">
                <Mapa 
                    onMapClick={handleMapClick} 
                    reportCoords={reportCoords} 
                    isReportMode={isReportMode}
                    reports={reports}
                />
                <RecyclingMenu />
                <ReportModal 
                    isReportMode={isReportMode} 
                    reportCoords={reportCoords} 
                    onClose={handleCloseReport}
                    onSubmit={handleSubmitReport}
                />
            </div>
        </div>
    );
}