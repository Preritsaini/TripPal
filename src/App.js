import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Navigation from './components/layout/Navigation';
import Dashboard from './pages/Dashboard';
import ItineraryPage from './pages/ItineraryPage';
import PackingPage from './pages/PackingPage';
import SettingsPage from './pages/SettingsPage';
import { useTheme } from './context/ThemeContext';
import './styles/global.css';

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const { theme } = useTheme();

    // Page routing
    const renderPage = () => {
        switch(currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'itinerary':
                return <ItineraryPage />;
            case 'packing':
                return <PackingPage />;
            case 'settings':
                return <SettingsPage />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className={`app ${theme}`}>
            <Header />
            <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <main className="main-content">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}

export default App;