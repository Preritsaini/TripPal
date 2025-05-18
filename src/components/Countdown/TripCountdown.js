import React, { useState, useEffect, useRef } from 'react';
import '/home/prerit/WebstormProjects/codecircuitproj/src/styles/components/countdown.css';

const TripCountdown = ({ targetDate }) => {

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });


    const [flipping, setFlipping] = useState({
        days: false,
        hours: false,
        minutes: false,
        seconds: false
    });


    const prevValues = useRef({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate) - new Date();
            let timeLeftValues = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                timeLeftValues = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }

            // Check if values have changed and trigger flip animation
            Object.keys(timeLeftValues).forEach(key => {
                if (timeLeftValues[key] !== prevValues.current[key]) {
                    setFlipping(prev => ({ ...prev, [key]: true }));

                    // Reset flip animation after it completes
                    setTimeout(() => {
                        setFlipping(prev => ({ ...prev, [key]: false }));
                    }, 800); // Animation duration
                }
            });

            // Update previous values
            prevValues.current = { ...timeLeftValues };

            return timeLeftValues;
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Set up interval for countdown
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Clean up timer
        return () => clearInterval(timer);
    }, [targetDate]);

    // Generate clouds for animation
    const generateClouds = () => {
        const clouds = [];
        const cloudCount = 5;

        for (let i = 0; i < cloudCount; i++) {
            // Randomize cloud properties
            const size = 30 + Math.random() * 70; // Size between 30 and 100
            const left = Math.random() * 100; // Position from 0% to 100%
            const animationDuration = 30 + Math.random() * 70; // Duration between 30 and 100 seconds
            const delay = Math.random() * 15; // Delay between 0 and 15 seconds
            const opacity = 0.3 + Math.random() * 0.3; // Opacity between 0.3 and 0.6

            clouds.push(
                <div
                    key={i}
                    className="cloud"
                    style={{
                        width: `${size}px`,
                        height: `${size * 0.6}px`,
                        left: `${left}%`,
                        animationDuration: `${animationDuration}s`,
                        animationDelay: `${delay}s`,
                        opacity: opacity
                    }}
                ></div>
            );
        }

        return clouds;
    };

    // Generate stars for animation
    const generateStars = () => {
        const stars = [];
        const starCount = 30;

        for (let i = 0; i < starCount; i++) {
            // Randomize star properties
            const size = 1 + Math.random() * 3; // Size between 1 and 4
            const left = Math.random() * 100; // Position from 0% to 100%
            const top = Math.random() * 100; // Position from 0% to 100%
            const animationDuration = 2 + Math.random() * 3; // Duration between 2 and 5 seconds
            const delay = Math.random() * 2; // Delay between 0 and 2 seconds

            stars.push(
                <div
                    key={i}
                    className="star"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${left}%`,
                        top: `${top}%`,
                        animationDuration: `${animationDuration}s`,
                        animationDelay: `${delay}s`
                    }}
                ></div>
            );
        }

        return stars;
    };

    // Create a FlipCard component
    const FlipCard = ({ value, label, isFlipping }) => (
        <div className="countdown-item">
            <div className={`flip-card ${isFlipping ? 'flipping' : ''}`}>
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        {String(value).padStart(2, '0')}
                    </div>
                    <div className="flip-card-back">
                        {String(value).padStart(2, '0')}
                    </div>
                </div>
            </div>
            <div className="countdown-label">{label}</div>
        </div>
    );

    // Determine if we should show day or night background
    const isDaytime = () => {
        const hours = new Date().getHours();
        return hours >= 6 && hours < 18;
    };

    return (
        <div className={`countdown-wrapper ${isDaytime() ? 'day' : 'night'}`}>
            <div className="sky-background">
                {isDaytime() ? generateClouds() : generateStars()}
                <div className={`celestial-body ${isDaytime() ? 'sun' : 'moon'}`}></div>
            </div>

            <h2 className="countdown-title">Your Adventure Begins In</h2>

            <div className="countdown-container">
                <FlipCard
                    value={timeLeft.days}
                    label="Days"
                    isFlipping={flipping.days}
                />

                <div className="countdown-separator">:</div>

                <FlipCard
                    value={timeLeft.hours}
                    label="Hours"
                    isFlipping={flipping.hours}
                />

                <div className="countdown-separator">:</div>

                <FlipCard
                    value={timeLeft.minutes}
                    label="Minutes"
                    isFlipping={flipping.minutes}
                />

                <div className="countdown-separator">:</div>

                <FlipCard
                    value={timeLeft.seconds}
                    label="Seconds"
                    isFlipping={flipping.seconds}
                />
            </div>

            <div className="countdown-message">
                {timeLeft.days > 30 && (
                    <p>Still plenty of time to plan your perfect trip!</p>
                )}
                {timeLeft.days <= 30 && timeLeft.days > 7 && (
                    <p>Less than a month to go! Time to finalize your plans.</p>
                )}
                {timeLeft.days <= 7 && timeLeft.days > 0 && (
                    <p>Almost there! Don't forget to check your packing list!</p>
                )}
                {timeLeft.days <= 0 && (
                    <p>Your adventure is about to begin! Safe travels!</p>
                )}
            </div>
        </div>
    );
};

export default TripCountdown;