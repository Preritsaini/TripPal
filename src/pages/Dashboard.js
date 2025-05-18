import React, { useRef, useEffect, useState } from 'react';
import { useTrip } from '/home/prerit/WebstormProjects/codecircuitproj/src/context/TripContext.js';
import { useTheme } from '/home/prerit/WebstormProjects/codecircuitproj/src/context/ThemeContext.js';
import TripCountdown from '/home/prerit/WebstormProjects/codecircuitproj/src/components/Countdown/TripCountdown.js';
import Button from '/home/prerit/WebstormProjects/codecircuitproj/src/components/common/Button.js';
import Card from '/home/prerit/WebstormProjects/codecircuitproj/src/components/common/Card.js';
import Modal from '/home/prerit/WebstormProjects/codecircuitproj/src/components/common/Modal.js';
import AnimatedButton from '/home/prerit/WebstormProjects/codecircuitproj/src/components/common/AnimatedButton.js';
import DateSelector from '/home/prerit/WebstormProjects/codecircuitproj/src/components/Countdown/DateSelector.js';
import '/home/prerit/WebstormProjects/codecircuitproj/src/styles/components/dashboard.css';

/**
 * Dashboard Component
 * The main dashboard view for the TravelBuddy app
 */
const Dashboard = () => {
    const { trip, updateTrip } = useTrip();
    const { theme } = useTheme();
    const dashboardRef = useRef(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedTrip, setEditedTrip] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('overview');

    // Animation for dashboard entrance with staggered timing
    useEffect(() => {
        const dashboard = dashboardRef.current;
        if (!dashboard) return;

        // Short timeout to ensure the component has fully rendered
        setTimeout(() => {
            setIsLoading(false);
        }, 300);

        const elements = dashboard.querySelectorAll('.animate-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animations with calculated delay
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach((el) => {
            observer.observe(el);
        });

        return () => {
            elements.forEach((el) => {
                if (observer) observer.unobserve(el);
            });
        };
    }, []);

    // Initialize edit form when modal opens
    useEffect(() => {
        if (showEditModal) {
            setEditedTrip({ ...trip });
        }
    }, [showEditModal, trip]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Calculate trip duration
    const calculateDuration = () => {
        if (!trip.startDate || !trip.endDate) return 0;

        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end day
        return diffDays;
    };

    // Get packing progress
    const getPackingProgress = () => {
        const totalItems = trip.packingList ? trip.packingList.length : 0;
        if (totalItems === 0) return 0;

        const packedItems = trip.packingList.filter(item => item.packed).length;
        return Math.round((packedItems / totalItems) * 100);
    };

    // Get itinerary completion (how many days have all details filled out)
    const getItineraryCompletion = () => {
        if (!trip.itinerary || trip.itinerary.length === 0) return 0;

        const completedDays = trip.itinerary.filter(day => day.activities && day.activities.length > 0).length;
        return Math.round((completedDays / trip.itinerary.length) * 100);
    };

    // Get today's activities if the trip is ongoing
    const getTodayActivities = () => {
        if (!trip.itinerary || !trip.startDate || !trip.endDate) return [];

        const today = new Date();
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);

        // If the trip is ongoing
        if (today >= startDate && today <= endDate) {
            // Calculate which day of the trip today is
            const diffTime = Math.abs(today - startDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            // Get the activities for this day, if they exist
            if (trip.itinerary[diffDays] && trip.itinerary[diffDays].activities) {
                return trip.itinerary[diffDays].activities;
            }
        }

        return [];
    };

    // Handle the trip edit form submission
    const handleSaveTrip = () => {
        if (!editedTrip) return;

        updateTrip(editedTrip);
        setShowEditModal(false);
        setEditedTrip(null);
    };

    // Handle form field changes
    const handleTripChange = (field, value) => {
        if (!editedTrip) return;

        setEditedTrip({
            ...editedTrip,
            [field]: value
        });
    };

    // Format time for display - FIX: Ensure proper time formatting
    const formatTime = (time) => {
        if (time === undefined || time === null) return 'Time not set';

        // Handle time as a number (like 14.5 for 2:30 PM)
        if (typeof time === 'number') {
            const hour = Math.floor(time);
            const minute = Math.round((time - hour) * 60);
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        }

        // Handle time as a string (like "14:30" or "2:30 PM")
        if (typeof time === 'string') {
            // Check if time already has AM/PM
            if (time.toUpperCase().includes('AM') || time.toUpperCase().includes('PM')) {
                return time;
            }

            // Otherwise, parse and format
            const [hourStr, minuteStr] = time.split(':');
            const hour = parseInt(hourStr, 10);
            const minute = parseInt(minuteStr, 10);

            if (isNaN(hour) || isNaN(minute)) return time;

            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        }

        return 'Invalid time';
    };

    // Get the trip status
    const getTripStatus = () => {
        if (!trip.startDate || !trip.endDate) return 'not-set';

        const today = new Date();
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);

        if (today < startDate) return 'upcoming';
        if (today > endDate) return 'completed';
        return 'active';
    };

    const tripStatus = getTripStatus();
    const todayActivities = getTodayActivities();

    // FIX: Prevent card click from triggering navigation if not intended
    const handleCardClick = (e, url) => {
        // Only navigate if the click wasn't on a button or other interactive element
        if (e.target.closest('button') === null) {
            window.location.hash = url;
        }
    };

    return (
        <div className={`dashboard ${isLoading ? 'dashboard--loading' : ''}`} ref={dashboardRef}>
            {/* Dashboard Header */}
            <div className="dashboard-header animate-item slide-up">
                <div className="dashboard-title-section">
                    <h1 className="dashboard-title">
                        {trip.destination ? (
                            <>Your Trip to <span className="destination-highlight">{trip.destination}</span></>
                        ) : (
                            'Plan Your Trip'
                        )}
                    </h1>
                    {trip.startDate && trip.endDate && (
                        <p className="trip-dates">
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                            <span className="trip-duration">({calculateDuration()} days)</span>
                        </p>
                    )}
                </div>

                <AnimatedButton
                    effect="float"
                    color="var(--accent-color, #FF7849)"
                    onClick={() => setShowEditModal(true)}
                    className="edit-trip-button"
                >
                    {trip.destination ? 'Edit Trip' : 'Set Trip Details'}
                </AnimatedButton>
            </div>

            {/* Countdown Section - only show for upcoming trips */}
            {tripStatus === 'upcoming' && trip.startDate && (
                <div className="countdown-container animate-item fade-in">
                    <TripCountdown targetDate={trip.startDate} />
                </div>
            )}

            {/* Trip Progress Indicator - for all trip states */}
            <div className="trip-progress-container animate-item fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="trip-progress-wrapper">
                    <div className="trip-progress-label">
                        <span>Trip Planning Progress</span>
                        <span className="trip-progress-percentage">
                            {Math.round((getPackingProgress() + getItineraryCompletion()) / 2)}%
                        </span>
                    </div>
                    <div className="trip-progress-bar">
                        <div
                            className="trip-progress-bar-fill"
                            style={{ width: `${Math.round((getPackingProgress() + getItineraryCompletion()) / 2)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="dashboard-tabs animate-item fade-in" style={{ animationDelay: '0.3s' }}>
                <button
                    className={`dashboard-tab ${activeSection === 'overview' ? 'dashboard-tab--active' : ''}`}
                    onClick={() => setActiveSection('overview')}
                >
                    Overview
                </button>
                <button
                    className={`dashboard-tab ${activeSection === 'today' ? 'dashboard-tab--active' : ''}`}
                    onClick={() => setActiveSection('today')}
                >
                    {tripStatus === 'active' ? "Today's Plan" : tripStatus === 'upcoming' ? 'Preparation' : 'Trip Summary'}
                </button>
                <button
                    className={`dashboard-tab ${activeSection === 'stats' ? 'dashboard-tab--active' : ''}`}
                    onClick={() => setActiveSection('stats')}
                >
                    Stats & Info
                </button>
            </div>

            {/* Main Dashboard Content */}
            <div className="dashboard-content">
                {/* Overview Section */}
                {activeSection === 'overview' && (
                    <div className="dashboard-grid">
                        {/* FIX: Modified Card components to prevent hover issues */}
                        <Card
                            variant="interactive"
                            animation="hover-lift"
                            className="dashboard-card animate-item slide-in-left"
                            onClick={(e) => handleCardClick(e, '#itinerary')}
                            header={
                                <div className="card-header">
                                    <div className="card-icon itinerary-icon">📋</div>
                                    <h3>Itinerary</h3>
                                </div>
                            }
                        >
                            <div className="card-content">
                                <p>
                                    You have planned <strong>{trip.itinerary ? trip.itinerary.reduce((total, day) => total + (day.activities ? day.activities.length : 0), 0) : 0}</strong> activities across <strong>{trip.itinerary ? trip.itinerary.length : 0}</strong> days.
                                </p>
                                <div className="progress-container">
                                    <div className="progress-label">
                                        <span>Planning completion</span>
                                        <span>{getItineraryCompletion()}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${getItineraryCompletion()}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-action">
                                <Button
                                    variant="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.hash = '#itinerary';
                                    }}
                                >
                                    View Itinerary
                                </Button>
                            </div>
                        </Card>

                        <Card
                            variant="interactive"
                            animation="hover-lift"
                            className="dashboard-card animate-item slide-up"
                            onClick={(e) => handleCardClick(e, '#packing')}
                            style={{ animationDelay: '0.2s' }}
                            header={
                                <div className="card-header">
                                    <div className="card-icon packing-icon">🧳</div>
                                    <h3>Packing List</h3>
                                </div>
                            }
                        >
                            <div className="card-content">
                                <p>
                                    You've packed <strong>{trip.packingList ? trip.packingList.filter(item => item.packed).length : 0}</strong> out of <strong>{trip.packingList ? trip.packingList.length : 0}</strong> items.
                                </p>
                                <div className="progress-container">
                                    <div className="progress-label">
                                        <span>Packing progress</span>
                                        <span>{getPackingProgress()}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${getPackingProgress()}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-action">
                                <Button
                                    variant="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.hash = '#packing';
                                    }}
                                >
                                    View Packing List
                                </Button>
                            </div>
                        </Card>

                        <Card
                            variant="interactive"
                            animation="hover-lift"
                            className="dashboard-card animate-item slide-in-right"
                            style={{ animationDelay: '0.4s' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                const url = tripStatus === 'active' ? '#itinerary' : '#settings';
                                handleCardClick(e, url);
                            }}
                            header={
                                <div className="card-header">
                                    <div className="card-icon today-icon">
                                        {tripStatus === 'active' ? '📍' : tripStatus === 'upcoming' ? '🗓️' : '✅'}
                                    </div>
                                    <h3>
                                        {tripStatus === 'active' ? "Today's Overview" :
                                            tripStatus === 'upcoming' ? 'Trip Countdown' :
                                                'Trip Completed'}
                                    </h3>
                                </div>
                            }
                        >
                            <div className="card-content">
                                {tripStatus === 'active' ? (
                                    <>
                                        <p>You're currently on your trip! {todayActivities.length > 0 ? `Here's what's planned for today:` : `No activities planned for today.`}</p>
                                        {todayActivities.length > 0 && (
                                            <ul className="today-activities-list">
                                                {todayActivities.map((activity, index) => (
                                                    <li key={index} className="today-activity-item">
                                                        {/* FIX: Improved time formatting */}
                                                        <span className="today-activity-time">
                                                            {formatTime(activity.startTime)}
                                                        </span>
                                                        <span className="today-activity-title">{activity.title}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : tripStatus === 'upcoming' ? (
                                    <p>Your trip hasn't started yet. Use this time to finish planning!</p>
                                ) : (
                                    <p>Your trip has ended. We hope you had a great time!</p>
                                )}
                            </div>
                            <div className="card-action">
                                <Button
                                    variant="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.hash = tripStatus === 'active' ? '#itinerary' : '#settings';
                                    }}
                                >
                                    {tripStatus === 'active' ? 'View Full Itinerary' :
                                        tripStatus === 'upcoming' ? 'Preparation Checklist' :
                                            'View Trip Summary'}
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Today's Plan / Preparation / Summary Section */}
                {activeSection === 'today' && (
                    <div className="today-section animate-item fade-in">
                        <Card
                            variant="elevated"
                            className="today-card"
                            animation="none"
                            header={
                                <div className="today-card-header">
                                    <h3>
                                        {tripStatus === 'active' ? "Today's Itinerary" :
                                            tripStatus === 'upcoming' ? 'Preparation Tasks' :
                                                'Trip Highlights'}
                                    </h3>
                                </div>
                            }
                        >
                            {tripStatus === 'active' ? (
                                todayActivities.length > 0 ? (
                                    <div className="today-timeline">
                                        {todayActivities.map((activity, index) => (
                                            <div key={index} className="timeline-item">
                                                {/* FIX: Improved time display */}
                                                <div className="timeline-time">
                                                    {formatTime(activity.startTime)}
                                                </div>
                                                <div className="timeline-connector">
                                                    <div className="timeline-dot" style={{ backgroundColor: activity.color || 'var(--accent-color, #FF7849)' }}></div>
                                                    {index < todayActivities.length - 1 && <div className="timeline-line"></div>}
                                                </div>
                                                <div className="timeline-content">
                                                    <h4 className="timeline-title">{activity.title}</h4>
                                                    {activity.location && (
                                                        <div className="timeline-location">
                                                            <span className="location-icon">📍</span> {activity.location}
                                                        </div>
                                                    )}
                                                    {activity.description && (
                                                        <p className="timeline-description">{activity.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">📝</div>
                                        <p>No activities planned for today</p>
                                        <Button
                                            variant="primary"
                                            onClick={() => window.location.hash = '#itinerary'}
                                        >
                                            Add Activities
                                        </Button>
                                    </div>
                                )
                            ) : tripStatus === 'upcoming' ? (
                                <div className="preparation-checklist">
                                    <div className="checklist-item">
                                        <input type="checkbox" id="check-itinerary" />
                                        <label htmlFor="check-itinerary">Complete your itinerary</label>
                                    </div>
                                    <div className="checklist-item">
                                        <input type="checkbox" id="check-packing" />
                                        <label htmlFor="check-packing">Pack your bags</label>
                                    </div>
                                    <div className="checklist-item">
                                        <input type="checkbox" id="check-documents" />
                                        <label htmlFor="check-documents">Prepare travel documents</label>
                                    </div>
                                    <div className="checklist-item">
                                        <input type="checkbox" id="check-transport" />
                                        <label htmlFor="check-transport">Confirm transportation</label>
                                    </div>
                                    <div className="checklist-item">
                                        <input type="checkbox" id="check-accommodation" />
                                        <label htmlFor="check-accommodation">Verify accommodation</label>
                                    </div>
                                </div>
                            ) : (
                                <div className="trip-summary">
                                    <div className="summary-stat">
                                        <div className="summary-number">{trip.itinerary ? trip.itinerary.length : 0}</div>
                                        <div className="summary-label">Days</div>
                                    </div>
                                    <div className="summary-stat">
                                        <div className="summary-number">
                                            {trip.itinerary ? trip.itinerary.reduce((total, day) => total + (day.activities ? day.activities.length : 0), 0) : 0}
                                        </div>
                                        <div className="summary-label">Activities</div>
                                    </div>
                                    <div className="summary-stat">
                                        <div className="summary-number">
                                            {trip.packingList ? trip.packingList.length : 0}
                                        </div>
                                        <div className="summary-label">Items Packed</div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {/* Stats Section */}
                {activeSection === 'stats' && (
                    <div className="stats-section animate-item fade-in">
                        <div className="stats-grid">
                            <Card
                                variant="elevated"
                                className="stats-card"
                                animation="none"
                                header={
                                    <div className="stats-card-header">
                                        <h3>Trip Overview</h3>
                                    </div>
                                }
                            >
                                <div className="stats-content">
                                    <div className="stat-row">
                                        <div className="stat-label">Destination</div>
                                        <div className="stat-value">{trip.destination || 'Not set'}</div>
                                    </div>
                                    <div className="stat-row">
                                        <div className="stat-label">Departure</div>
                                        <div className="stat-value">{formatDate(trip.startDate)}</div>
                                    </div>
                                    <div className="stat-row">
                                        <div className="stat-label">Return</div>
                                        <div className="stat-value">{formatDate(trip.endDate)}</div>
                                    </div>
                                    <div className="stat-row">
                                        <div className="stat-label">Duration</div>
                                        <div className="stat-value">{calculateDuration()} days</div>
                                    </div>
                                    <div className="stat-row">
                                        <div className="stat-label">Trip Status</div>
                                        <div className="stat-value">
                                            <span className={`status-badge status-${tripStatus}`}>
                                                {tripStatus === 'active' ? 'In Progress' :
                                                    tripStatus === 'upcoming' ? 'Upcoming' :
                                                        tripStatus === 'completed' ? 'Completed' : 'Not Set'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card
                                variant="elevated"
                                className="stats-card"
                                animation="none"
                                header={
                                    <div className="stats-card-header">
                                        <h3>Planning Stats</h3>
                                    </div>
                                }
                            >
                                <div className="stats-content">
                                    <div className="stat-row">
                                        <div className="stat-label">Days Planned</div>
                                        <div className="stat-value">{trip.itinerary ? trip.itinerary.length : 0}</div>
                                    </div>
                                    <div className="stat-row">
                                        <div className="stat-label">Activities</div>
                                        <div className="stat-value">
                                            {trip.itinerary ? trip.itinerary.reduce((total, day) => total + (day.activities ? day.activities.length : 0), 0) : 0}
                                        </div>
                                    </div>
                                    <div className="stat-row">
                                        <div className="stat-label">Packing Items</div>
                                        <div className="stat-value">{trip.packingList ? trip.packingList.length : 0}</div>
                                    </div>
                                    <div className="stat-row">
                                        <div className="stat-label">Itinerary Completion</div>
                                        <div className="stat-value">{getItineraryCompletion()}%</div>
                                    </div>
                                    <div className="stat-row">
                                        <div className="stat-label">Packing Progress</div>
                                        <div className="stat-value">{getPackingProgress()}%</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions animate-item fade-in" style={{ animationDelay: '0.6s' }}>
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                    <Button
                        variant="outline"
                        leftIcon={<span className="action-icon add-icon">➕</span>}
                        onClick={() => window.location.hash = '#itinerary'}
                    >
                        Add Activity
                    </Button>
                    <Button
                        variant="outline"
                        leftIcon={<span className="action-icon edit-icon">✏️</span>}
                        onClick={() => setShowEditModal(true)}
                    >
                        Edit Trip Details
                    </Button>
                    <Button
                        variant="outline"
                        leftIcon={<span className="action-icon share-icon">📤</span>}
                    >
                        Share Trip
                    </Button>
                    <Button
                        variant="outline"
                        leftIcon={<span className="action-icon export-icon">📁</span>}
                    >
                        Export Trip
                    </Button>
                </div>
            </div>

            {/* Edit Trip Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Trip Details"
                size="medium"
                animation="slide"
                footer={
                    <div className="modal-footer">
                        <Button
                            variant="text"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSaveTrip}
                        >
                            Save Trip
                        </Button>
                    </div>
                }
            >
                {editedTrip && (
                    <div className="edit-trip-form">
                        <div className="form-group">
                            <label className="form-label">Destination</label>
                            <input
                                type="text"
                                className="form-input"
                                value={editedTrip.destination || ''}
                                onChange={(e) => handleTripChange('destination', e.target.value)}
                                placeholder="Where are you going?"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Start Date</label>
                                <DateSelector
                                    mode="single"
                                    initialDate={editedTrip.startDate ? new Date(editedTrip.startDate) : null}
                                    onChange={(date) => handleTripChange('startDate', date)}
                                    minDate={new Date()}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">End Date</label>
                                <DateSelector
                                    mode="single"
                                    initialDate={editedTrip.endDate ? new Date(editedTrip.endDate) : null}
                                    onChange={(date) => handleTripChange('endDate', date)}
                                    minDate={editedTrip.startDate ? new Date(editedTrip.startDate) : new Date()}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Trip Notes</label>
                            <textarea
                                className="form-textarea"
                                value={editedTrip.notes || ''}
                                onChange={(e) => handleTripChange('notes', e.target.value)}
                                placeholder="Any additional notes about your trip"
                                rows={4}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Dashboard;
