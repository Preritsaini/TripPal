import React, { useState, useRef, useEffect } from 'react';
import '../styles/components/drag-handle.css';

/**
 * DragHandle Component
 * A versatile drag handle for reordering items with animations and touch support
 *
 * @param {function} onDragStart - Callback when drag starts
 * @param {function} onDrag - Callback during drag with position data
 * @param {function} onDragEnd - Callback when drag ends
 * @param {string} orientation - 'vertical' or 'horizontal'
 * @param {boolean} disabled - Whether dragging is disabled
 * @param {string} variant - 'default', 'minimal', 'lines', or 'dots'
 * @param {string} pulseColor - Color for the optional pulse effect
 */
const DragHandle = ({
                        onDragStart,
                        onDrag,
                        onDragEnd,
                        orientation = 'vertical',
                        disabled = false,
                        variant = 'default',
                        pulseColor,
                        className = '',
                        ...props
                    }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);
    const [showPulse, setShowPulse] = useState(false);

    const handleRef = useRef(null);
    const dragTimeout = useRef(null);

    // Handle mouse down event to initiate drag
    const handleMouseDown = (e) => {
        if (disabled) return;

        // Prevent default behaviors
        e.preventDefault();

        // Set initial position
        setStartPosition({
            x: e.clientX,
            y: e.clientY
        });

        // Reset state
        setIsDragging(true);
        setHasMoved(false);
        setCurrentOffset({ x: 0, y: 0 });

        // Add event listeners for dragging
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Notify parent component
        if (onDragStart) {
            onDragStart();
        }
    };

    // Handle touch start event (for mobile)
    const handleTouchStart = (e) => {
        if (disabled) return;

        // Prevent default behaviors for touch
        e.preventDefault();

        const touch = e.touches[0];

        // Set initial position
        setStartPosition({
            x: touch.clientX,
            y: touch.clientY
        });

        // Reset state
        setIsDragging(true);
        setHasMoved(false);
        setCurrentOffset({ x: 0, y: 0 });

        // Add event listeners for touch dragging
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);

        // Notify parent component
        if (onDragStart) {
            onDragStart();
        }
    };

    // Handle mouse movement during drag
    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const offset = {
            x: e.clientX - startPosition.x,
            y: e.clientY - startPosition.y
        };

        // Update offset state
        setCurrentOffset(offset);

        // Indicate that there has been movement
        if (Math.abs(offset.x) > 5 || Math.abs(offset.y) > 5) {
            setHasMoved(true);
        }

        // Notify parent component
        if (onDrag) {
            onDrag({
                x: offset.x,
                y: offset.y,
                event: e
            });
        }
    };

    // Handle touch movement (for mobile)
    const handleTouchMove = (e) => {
        if (!isDragging) return;

        const touch = e.touches[0];

        const offset = {
            x: touch.clientX - startPosition.x,
            y: touch.clientY - startPosition.y
        };

        // Update offset state
        setCurrentOffset(offset);

        // Indicate that there has been movement
        if (Math.abs(offset.x) > 5 || Math.abs(offset.y) > 5) {
            setHasMoved(true);
        }

        // Notify parent component
        if (onDrag) {
            onDrag({
                x: offset.x,
                y: offset.y,
                event: e
            });
        }
    };

    // Handle mouse up to end drag
    const handleMouseUp = (e) => {
        if (!isDragging) return;

        // Clean up event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Reset state
        setIsDragging(false);

        // Notify parent component
        if (onDragEnd) {
            onDragEnd({
                x: currentOffset.x,
                y: currentOffset.y,
                hasMoved,
                event: e
            });
        }
    };

    // Handle touch end (for mobile)
    const handleTouchEnd = (e) => {
        if (!isDragging) return;

        // Clean up event listeners
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);

        // Reset state
        setIsDragging(false);

        // Notify parent component
        if (onDragEnd) {
            onDragEnd({
                x: currentOffset.x,
                y: currentOffset.y,
                hasMoved,
                event: e
            });
        }
    };

    // Trigger a pulse effect to indicate draggability
    const triggerPulse = () => {
        if (disabled) return;

        setShowPulse(true);

        // Clear any existing timeout
        if (dragTimeout.current) {
            clearTimeout(dragTimeout.current);
        }

        // Clear the pulse after animation completes
        dragTimeout.current = setTimeout(() => {
            setShowPulse(false);
        }, 700); // Match this timing with CSS animation duration
    };

    // Clean up event listeners when component unmounts
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);

            if (dragTimeout.current) {
                clearTimeout(dragTimeout.current);
            }
        };
    }, []);

    return (
        <div
            ref={handleRef}
            className={`
        tb-drag-handle
        tb-drag-handle--${orientation}
        tb-drag-handle--${variant}
        ${isDragging ? 'tb-drag-handle--dragging' : ''}
        ${disabled ? 'tb-drag-handle--disabled' : ''}
        ${showPulse ? 'tb-drag-handle--pulse' : ''}
        ${className}
      `}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseEnter={triggerPulse}
            style={{
                '--pulse-color': pulseColor || 'rgba(29, 122, 252, 0.4)'
            }}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label="Drag to reorder"
            onKeyDown={(e) => {
                // Allow keyboard activation (for accessibility)
                if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    triggerPulse();
                }
            }}
            {...props}
        >
            {/* Visual elements based on variant */}
            {variant === 'default' && (
                <>
                    <span className="tb-drag-handle__line"></span>
                    <span className="tb-drag-handle__line"></span>
                    <span className="tb-drag-handle__line"></span>
                </>
            )}

            {variant === 'dots' && (
                <>
                    <div className="tb-drag-handle__dot-row">
                        <span className="tb-drag-handle__dot"></span>
                        <span className="tb-drag-handle__dot"></span>
                    </div>
                    <div className="tb-drag-handle__dot-row">
                        <span className="tb-drag-handle__dot"></span>
                        <span className="tb-drag-handle__dot"></span>
                    </div>
                    <div className="tb-drag-handle__dot-row">
                        <span className="tb-drag-handle__dot"></span>
                        <span className="tb-drag-handle__dot"></span>
                    </div>
                </>
            )}

            {variant === 'lines' && (
                <>
                    <span className="tb-drag-handle__line"></span>
                    <span className="tb-drag-handle__line"></span>
                </>
            )}

            {/* Minimal variant has no visual elements, just the container */}

            {/* Pulse effect element */}
            <span className="tb-drag-handle__pulse"></span>
        </div>
    );
};

export default DragHandle;