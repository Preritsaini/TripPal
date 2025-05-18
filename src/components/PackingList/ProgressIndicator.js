import React, { useEffect, useRef, useState } from 'react';
import '../../styles/components/packingList.css';

const ProgressIndicator = ({ progress, totalItems, packedItems }) => {
    const progressBarRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [displayedProgress, setDisplayedProgress] = useState(0);

    // Make progress indicator visible after a short delay
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsVisible(true);
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    // Animate progress bar filling
    useEffect(() => {
        if (!isVisible) return;

        const duration = 1500; // Animation duration in ms
        const steps = 60; // Number of steps in animation
        const stepTime = duration / steps;
        let currentStep = 0;

        const startValue = displayedProgress;
        const endValue = progress;
        const diff = endValue - startValue;

        // If no change in progress, skip animation
        if (diff === 0) return;

        const timer = setInterval(() => {
            currentStep++;

            const easeOutCubic = 1 - Math.pow(1 - currentStep / steps, 3);
            const newValue = startValue + diff * easeOutCubic;

            setDisplayedProgress(Math.round(newValue));

            if (currentStep >= steps) {
                clearInterval(timer);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [progress, isVisible]);

    // Get message based on progress
    const getMessage = () => {
        if (progress === 0) return "Let's start packing!";
        if (progress < 25) return "Great start!";
        if (progress < 50) return "Making progress!";
        if (progress < 75) return "More than halfway there!";
        if (progress < 100) return "Almost done!";
        return "All packed and ready to go!";
    };

    // Get color based on progress
    const getProgressColor = () => {
        if (progress < 25) return 'var(--warning-color)';
        if (progress < 50) return 'var(--warning-color)';
        if (progress < 75) return 'var(--primary-color)';
        if (progress < 100) return 'var(--primary-color)';
        return 'var(--success-color)';
    };

    return (
        <div className={`progress-indicator ${isVisible ? 'visible' : ''}`}>
            <div className="progress-text">
                <div className="progress-message">{getMessage()}</div>
                <div className="progress-stats">
                    <span className="packed-count">{packedItems}</span> of
                    <span className="total-count"> {totalItems}</span> items packed
                </div>
            </div>

            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    ref={progressBarRef}
                    style={{
                        width: `${displayedProgress}%`,
                        backgroundColor: getProgressColor()
                    }}
                >
                    <div className="progress-percentage">{displayedProgress}%</div>
                </div>
            </div>

            {/* Animated particles for completed progress */}
            {displayedProgress === 100 && (
                <div className="progress-celebration">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className="celebration-particle"
                            style={{
                                animationDelay: `${i * 0.1}s`,
                                left: `${10 + i * 8}%`
                            }}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProgressIndicator;