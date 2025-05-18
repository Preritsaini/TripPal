import React, { useRef, useEffect } from 'react';
import '../styles/components/animated-button.css';

/**
 * AnimatedButton Component
 * A button with advanced animations and interactive effects
 *
 * @param {string} effect - 'magnetic', 'shine', 'fill', 'border-dance', or 'float'
 * @param {string} color - Primary color (supports CSS variables)
 * @param {string} hoverColor - Color on hover (supports CSS variables)
 * @param {string} textColor - Text color (supports CSS variables)
 * @param {function} onClick - Click handler
 */
const AnimatedButton = ({
                            children,
                            effect = 'shine',
                            color = 'var(--primary-color)',
                            hoverColor = 'var(--primary-dark)',
                            textColor = 'white',
                            onClick,
                            className = '',
                            ...props
                        }) => {
    const buttonRef = useRef(null);

    // Set up magnetic effect
    useEffect(() => {
        if (effect !== 'magnetic' || !buttonRef.current) return;

        const button = buttonRef.current;
        let boundingRect = {};

        const magneticEffect = (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = boundingRect;

            // Calculate the center of the button
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            // Calculate the distance from the mouse to the center
            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;

            // Calculate the distance as a percentage of the button size
            // with a maximum movement of 10px
            const percentX = deltaX / width * 10;
            const percentY = deltaY / height * 10;

            // Apply the transform
            button.style.transform = `translate(${percentX}px, ${percentY}px)`;
        };

        const resetPosition = () => {
            button.style.transform = '';
        };

        const updateBoundingRect = () => {
            boundingRect = button.getBoundingClientRect();
        };

        // Add event listeners for the magnetic effect
        button.addEventListener('mouseenter', updateBoundingRect);
        button.addEventListener('mousemove', magneticEffect);
        button.addEventListener('mouseleave', resetPosition);

        // Clean up event listeners
        return () => {
            button.removeEventListener('mouseenter', updateBoundingRect);
            button.removeEventListener('mousemove', magneticEffect);
            button.removeEventListener('mouseleave', resetPosition);
        };
    }, [effect]);

    // Handle shine effect
    const handleShine = (e) => {
        if (effect !== 'shine' || !buttonRef.current) return;

        const button = buttonRef.current;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create a shine element
        const shine = document.createElement('span');
        shine.className = 'tb-animated-button__shine';

        // Position the shine element at the mouse position
        shine.style.top = `${y}px`;
        shine.style.left = `${x}px`;

        button.appendChild(shine);

        // Remove the shine element after animation completes
        setTimeout(() => {
            shine.remove();
        }, 700);
    };

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            onMouseMove={effect === 'shine' ? handleShine : undefined}
            className={`
        tb-animated-button
        tb-animated-button--${effect}
        ${className}
      `}
            style={{
                '--button-color': color,
                '--button-hover-color': hoverColor,
                '--button-text-color': textColor,
            }}
            {...props}
        >
            {effect === 'border-dance' && (
                <span className="tb-animated-button__border"></span>
            )}

            <span className="tb-animated-button__content">
        {children}
      </span>

            {effect === 'fill' && (
                <span className="tb-animated-button__fill"></span>
            )}
        </button>
    );
};

export default AnimatedButton;
