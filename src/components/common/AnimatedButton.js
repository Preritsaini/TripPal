import React, { useRef, useEffect } from 'react';
import '/home/prerit/WebstormProjects/codecircuitproj/src/styles/components/animated-button.css';
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
    useEffect(() => {
        if (effect !== 'magnetic' || !buttonRef.current) return;

        const button = buttonRef.current;
        let boundingRect = {};

        const magneticEffect = (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = boundingRect;

            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;

            const percentX = deltaX / width * 10;
            const percentY = deltaY / height * 10;
            button.style.transform = `translate(${percentX}px, ${percentY}px)`;
        };

        const resetPosition = () => {
            button.style.transform = '';
        };

        const updateBoundingRect = () => {
            boundingRect = button.getBoundingClientRect();
        };

        button.addEventListener('mouseenter', updateBoundingRect);
        button.addEventListener('mousemove', magneticEffect);
        button.addEventListener('mouseleave', resetPosition);

        return () => {
            button.removeEventListener('mouseenter', updateBoundingRect);
            button.removeEventListener('mousemove', magneticEffect);
            button.removeEventListener('mouseleave', resetPosition);
        };
    }, [effect]);
    const handleShine = (e) => {
        if (effect !== 'shine' || !buttonRef.current) return;

        const button = buttonRef.current;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const shine = document.createElement('span');
        shine.className = 'tb-animated-button__shine';


        shine.style.top = `${y}px`;
        shine.style.left = `${x}px`;

        button.appendChild(shine);

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
