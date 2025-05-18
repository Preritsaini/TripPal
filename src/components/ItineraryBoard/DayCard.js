import React, { useState, useRef, useEffect } from 'react';
import '../../styles/components/itinerary.css';

const DayCard = ({ day, dayIndex, children, className, style }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [weather, setWeather] = useState(getRandomWeather());
    const [showWeather, setShowWeather] = useState(false);
    const contentRef = useRef(null);
    const cardRef = useRef(null);

    // Show weather with animation after card loads
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWeather(true);
        }, 1000 + dayIndex * 300);

        return () => clearTimeout(timer);
    }, [dayIndex]);

    // Get a random weather condition for demo
    function getRandomWeather() {
        const conditions = [
            { type: 'sunny', temp: Math.floor(Math.random() * 15) + 20, icon: '☀️' },
            { type: 'partly-cloudy', temp: Math.floor(Math.random() * 10) + 18, icon: '⛅' },
            { type: 'cloudy', temp: Math.floor(Math.random() * 10) + 15, icon: '☁️' },
            { type: 'rainy', temp: Math.floor(Math.random() * 8) + 12, icon: '🌧️' },
            { type: 'stormy', temp: Math.floor(Math.random() * 5) + 10, icon: '⛈️' }
        ];

        return conditions[Math.floor(Math.random() * conditions.length)];
    }

    // Toggle expand/collapse with animation
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div
            className={`day-card ${isExpanded ? 'expanded' : 'collapsed'} ${className}`}
            data-day-index={dayIndex}
            ref={cardRef}
            style={style}
        >
            <div className="day-header" onClick={toggleExpand}>
                <div className="day-info">
                    <h3 className="day-title">{day.dayName}</h3>
                    <span className="day-date">{formatDate(day.date)}</span>
                </div>

                <div className={`day-weather ${showWeather ? 'visible' : ''}`}>
                    <div className="weather-icon" data-weather={weather.type}>
                        {weather.icon}
                        <div className="weather-animation"></div>
                    </div>
                    <div className="weather-temp">{weather.temp}°C</div>
                </div>

                <button className="expand-btn">
                    <span className={`arrow ${isExpanded ? 'up' : 'down'}`}></span>
                </button>
            </div>

            <div
                className="day-content"
                ref={contentRef}
                style={
                    isExpanded
                        ? { height: contentRef.current ? contentRef.current.scrollHeight + 'px' : 'auto' }
                        : { height: '0px' }
                }
            >
                {children}
            </div>
        </div>
    );
};

export default DayCard;