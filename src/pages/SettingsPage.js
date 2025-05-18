import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/components/settings.css';

const SettingsPage = () => {
    const { trip, updateDestination, updateDates, resetTrip, exportTrip, importTrip } = useTrip();
    const { theme } = useTheme();

    const [destination, setDestination] = useState(trip.destination);
    const [startDate, setStartDate] = useState(trip.startDate);
    const [endDate, setEndDate] = useState(trip.endDate);
    const [importFile, setImportFile] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        updateDestination(destination);
        updateDates(startDate, endDate);

        // Show success notification
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    // Handle trip reset
    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all trip data? This cannot be undone.')) {
            resetTrip();
            // Show success notification
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        }
    };

    // Handle trip export
    const handleExport = () => {
        exportTrip();
    };

    // Handle file input change
    const handleFileChange = (e) => {
        setImportFile(e.target.files[0]);
    };

    // Handle trip import
    const handleImport = () => {
        if (!importFile) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const result = importTrip(e.target.result);

                if (result) {
                    // Show success notification
                    setShowSuccess(true);
                    setTimeout(() => {
                        setShowSuccess(false);
                    }, 3000);
                } else {
                    // Show error notification
                    setShowError(true);
                    setTimeout(() => {
                        setShowError(false);
                    }, 3000);
                }
            } catch (error) {
                console.error("Failed to import trip:", error);

                // Show error notification
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 3000);
            }
        };

        reader.readAsText(importFile);
    };

    return (
        <div className="settings-page">
            <h2 className="settings-title">Trip Settings</h2>

            <div className="settings-container">
                <div className="settings-section">
                    <h3>Trip Details</h3>
                    <form onSubmit={handleSubmit} className="settings-form">
                        <div className="form-group">
                            <label htmlFor="destination">Destination</label>
                            <input
                                id="destination"
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="e.g., Tokyo, Japan"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="start-date">Start Date</label>
                                <input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="end-date">End Date</label>
                                <input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </form>
                </div>

                <div className="settings-section">
                    <h3>Data Management</h3>

                    <div className="settings-actions">
                        <div className="action-card export-card">
                            <div className="action-icon">📤</div>
                            <div className="action-content">
                                <h4>Export Trip Data</h4>
                                <p>Download your trip data as a JSON file for backup or sharing.</p>
                            </div>
                            <button
                                className="btn btn-secondary"
                                onClick={handleExport}
                            >
                                Export
                            </button>
                        </div>

                        <div className="action-card import-card">
                            <div className="action-icon">📥</div>
                            <div className="action-content">
                                <h4>Import Trip Data</h4>
                                <p>Import a previously saved trip JSON file.</p>
                            </div>
                            <div className="import-controls">
                                <input
                                    type="file"
                                    id="import-file"
                                    accept=".json"
                                    onChange={handleFileChange}
                                />
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleImport}
                                    disabled={!importFile}
                                >
                                    Import
                                </button>
                            </div>
                        </div>

                        <div className="action-card reset-card">
                            <div className="action-icon">🔄</div>
                            <div className="action-content">
                                <h4>Reset Trip Data</h4>
                                <p>Reset all trip data to default values. This cannot be undone.</p>
                            </div>
                            <button
                                className="btn btn-danger"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className={`notification success ${showSuccess ? 'show' : ''}`}>
                Changes saved successfully!
            </div>

            <div className={`notification error ${showError ? 'show' : ''}`}>
                Error processing file. Please try again.
            </div>
        </div>
    );
};

export default SettingsPage;