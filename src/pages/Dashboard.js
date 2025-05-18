import React, { useRef, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import TripCountdown from '../components/Countdown/TripCountdown';
import '../styles/components/dashboard.css';

const Dashboard = () => {
    const { trip } = useTrip();
    const dashboardRef = useRef(null);

    // Animation for dashboard entrance
    useEffect(() => {
        const dashboard = dashboardRef.current;
        if (!dashboard) return;

        const elements = dashboard.querySelectorAll('.animate-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach((el) => {
            observer.observe(el);
        });

        return () => {
            elements.forEach((el) => {
                observer.unobserve(el);
            });
        };
    }, []);

    // Format date for display
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Calculate trip duration
    const calculateDuration = () => {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Get packing progress
    const getPackingProgress = () => {
        const totalItems = trip.packingList.length;
        if (totalItems === 0) return 0;

        const packedItems = trip.packingList.filter(item => item.packed).length;
        return Math.round((packedItems / totalItems) * 100);
    };

    return (
        <div className="dashboard" ref={dashboardRef}>
            <div className="dashboard-header animate-item slide-up">
                <h1>Your Trip to {trip.destination}</h1>
                <p className="trip-dates">
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    <span className="trip-duration">({calculateDuration()} days)</span>
                </p>
            </div>

            <div className="countdown-container animate-item fade-in">
                <TripCountdown targetDate={trip.startDate} />
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card animate-item slide-in-left">
                    <div className="card-icon itinerary-icon"></div>
                    <h3>Itinerary</h3>
                    <p>You have planned <strong>{trip.itinerary.reduce((total, day) => total + day.activities.length, 0)}</strong> activities across <strong>{trip.itinerary.length}</strong> days.</p>
                    <div className="card-action">
                        <button className="btn btn-primary" onClick={() => window.location.hash = '#itinerary'}>View Itinerary</button>
                    </div>
                </div>

                <div className="dashboard-card animate-item slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="card-icon packing-icon"></div>
                    <h3>Packing List</h3>
                    <p>You've packed <strong>{trip.packingList.filter(item => item.packed).length}</strong> out of <strong>{trip.packingList.length}</strong> items.</p>
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${getPackingProgress()}%` }}
                        ></div>
                    </div>
                    <div className="card-action">
                        <button className="btn btn-primary" onClick={() => window.location.hash = '#packing'}>View Packing List</button>
                    </div>
                </div>

                <div className="dashboard-card animate-item slide-in-right" style={{ animationDelay: '0.4s' }}>
                    <div className="card-icon today-icon"></div>
                    <h3>Today's Overview</h3>
                    {new Date() > new Date(trip.startDate) && new Date() < new Date(trip.endDate) ? (
                        <>
                            <p>You're currently on your trip! Here's what's planned for today:</p>
                            {/* We would show today's activities here */}
                        </>
                    ) : new Date() > new Date(trip.endDate) ? (
                        <p>Your trip has ended. We hope you had a great time!</p>
                    ) : (
                        <p>Your trip hasn't started yet. Use this time to finish planning!</p>
                    )}
                </div>
            </div>

            <div className="quick-actions animate-item fade-in" style={{ animationDelay: '0.6s' }}>
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                    <button className="btn btn-secondary">
                        <span className="action-icon add-icon"></span>
                        Add Activity
                    </button>
                    <button className="btn btn-secondary">
                        <span className="action-icon edit-icon"></span>
                        Edit Trip Details
                    </button>
                    <button className="btn btn-secondary">
                        <span className="action-icon share-icon"></span>
                        Share Trip
                    </button>
                    <button className="btn btn-secondary">
                        <span className="action-icon export-icon"></span>
                        Export Trip
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;