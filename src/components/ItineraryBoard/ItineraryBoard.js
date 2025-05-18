import React, { useState, useEffect, useRef } from 'react';
import { useTrip } from '../../context/TripContext';
import DayCard from './DayCard';
import ActivityItem from './ActivityItem';
import { v4 as uuidv4 } from 'uuid';
import '../../styles/components/itinerary.css';

const ItineraryBoard = () => {
    const { trip, reorderActivities, moveActivity, addActivity, removeActivity } = useTrip();
    const [draggingActivity, setDraggingActivity] = useState(null);
    const [dragSource, setDragSource] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);
    const [draggedElement, setDraggedElement] = useState(null);
    const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
    const boardRef = useRef(null);
    const initialPointerPosition = useRef({ x: 0, y: 0 });
    const currentPointerPosition = useRef({ x: 0, y: 0 });

    // Animation timing control
    const [loadedDays, setLoadedDays] = useState([]);

    // Load days one by one with animation
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loadedDays.length < trip.itinerary.length) {
                setLoadedDays(prev => [...prev, trip.itinerary[loadedDays.length].day]);
            }
        }, 200); // 200ms delay between each day appearing

        return () => clearTimeout(timer);
    }, [loadedDays, trip.itinerary]);

    // Initial load animation
    useEffect(() => {
        if (loadedDays.length === 0 && trip.itinerary.length > 0) {
            setLoadedDays([trip.itinerary[0].day]);
        }
    }, [trip.itinerary]);

    // Handle drag start
    const handleDragStart = (e, activity, dayIndex, activityIndex) => {
        // Prevent default to avoid browser's default drag behavior
        e.preventDefault();

        // Set initial pointer position
        initialPointerPosition.current = {
            x: e.clientX,
            y: e.clientY
        };

        currentPointerPosition.current = {
            x: e.clientX,
            y: e.clientY
        };

        // Find the element that is being dragged
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();

        // Set dragging state
        setDraggingActivity(activity);
        setDragSource({ dayIndex, activityIndex });
        setDraggedElement(element);

        // Create ghost element for smooth dragging
        const ghost = element.cloneNode(true);
        ghost.style.position = 'fixed';
        ghost.style.top = `${rect.top}px`;
        ghost.style.left = `${rect.left}px`;
        ghost.style.width = `${rect.width}px`;
        ghost.style.height = `${rect.height}px`;
        ghost.style.pointerEvents = 'none';
        ghost.style.transition = 'none';
        ghost.style.zIndex = '1000';
        ghost.style.opacity = '0.8';
        ghost.style.transform = 'scale(1.05)';
        ghost.style.boxShadow = '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)';
        ghost.classList.add('activity-ghost');

        // Add the ghost to the DOM
        document.body.appendChild(ghost);

        // Add event listeners for drag movement and end
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('mouseleave', handleDragEnd);

        // Give visual indication to the original element
        element.classList.add('dragging');

        // Start drag visual effects
        element.style.opacity = '0.4';
        element.style.transform = 'scale(0.95)';
    };

    // Handle dragging movement
    const handleDragMove = (e) => {
        if (!draggingActivity) return;

        // Update current pointer position
        currentPointerPosition.current = {
            x: e.clientX,
            y: e.clientY
        };

        // Calculate movement delta
        const dx = currentPointerPosition.current.x - initialPointerPosition.current.x;
        const dy = currentPointerPosition.current.y - initialPointerPosition.current.y;

        // Update ghost element position
        const ghostElement = document.querySelector('.activity-ghost');
        if (ghostElement) {
            ghostElement.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;

            // Save position for potential animation
            setGhostPosition({ x: dx, y: dy });
        }

        // Find potential drop target
        const elementsUnderPointer = document.elementsFromPoint(e.clientX, e.clientY);
        const dayCard = elementsUnderPointer.find(el => el.classList.contains('day-card'));
        const activityItem = elementsUnderPointer.find(el => el.classList.contains('activity-item') && !el.classList.contains('dragging'));

        if (dayCard) {
            const dayIndex = parseInt(dayCard.dataset.dayIndex, 10);

            if (activityItem) {
                // We're over another activity
                const activityIndex = parseInt(activityItem.dataset.activityIndex, 10);
                setDropTarget({ dayIndex, activityIndex, type: 'activity' });

                // Highlight drop position
                activityItem.classList.add('drop-target');
            } else {
                // We're over a day card but not on a specific activity
                setDropTarget({ dayIndex, type: 'day' });

                // Highlight the day card
                dayCard.classList.add('drop-target-day');
            }
        } else {
            // Clear drop target if not over valid target
            setDropTarget(null);

            // Remove all highlights
            document.querySelectorAll('.drop-target').forEach(el => {
                el.classList.remove('drop-target');
            });

            document.querySelectorAll('.drop-target-day').forEach(el => {
                el.classList.remove('drop-target-day');
            });
        }
    };

    // Handle drop
    const handleDragEnd = (e) => {
        if (!draggingActivity || !dragSource) return;

        // Clean up ghost element
        const ghostElement = document.querySelector('.activity-ghost');
        if (ghostElement) {
            // Animate the ghost back to original position or to drop target
            if (dropTarget) {
                // Find target element position
                let targetElement;

                if (dropTarget.type === 'activity') {
                    targetElement = document.querySelector(`.day-card[data-day-index="${dropTarget.dayIndex}"] .activity-item[data-activity-index="${dropTarget.activityIndex}"]`);
                } else {
                    targetElement = document.querySelector(`.day-card[data-day-index="${dropTarget.dayIndex}"] .activities-container`);
                }

                if (targetElement) {
                    const targetRect = targetElement.getBoundingClientRect();
                    const ghostRect = ghostElement.getBoundingClientRect();

                    // Calculate final position for animation
                    const finalX = targetRect.left - ghostRect.left + ghostPosition.x;
                    const finalY = targetRect.top - ghostRect.top + ghostPosition.y;

                    // Animate to final position
                    ghostElement.style.transition = 'transform 0.3s cubic-bezier(0.2, 1, 0.1, 1)';
                    ghostElement.style.transform = `translate(${finalX}px, ${finalY}px) scale(0.95)`;
                    ghostElement.style.opacity = '0';

                    // Execute the actual reordering/moving
                    if (dropTarget.type === 'activity') {
                        if (dropTarget.dayIndex === dragSource.dayIndex) {
                            // Reorder within same day
                            reorderActivities(dropTarget.dayIndex, dragSource.activityIndex, dropTarget.activityIndex);
                        } else {
                            // Move to different day
                            moveActivity(dragSource.dayIndex, dropTarget.dayIndex, dragSource.activityIndex);
                        }
                    } else {
                        // Add to end of day
                        moveActivity(dragSource.dayIndex, dropTarget.dayIndex, dragSource.activityIndex);
                    }

                    // Remove ghost after animation
                    setTimeout(() => {
                        ghostElement.remove();
                    }, 300);
                }
            } else {
                // No valid drop target, animate back to original
                ghostElement.style.transition = 'transform 0.5s cubic-bezier(0.2, 1, 0.1, 1)';
                ghostElement.style.transform = 'translate(0, 0) scale(1)';

                // Fade out
                ghostElement.style.opacity = '0';

                // Remove after animation
                setTimeout(() => {
                    ghostElement.remove();
                }, 500);
            }
        }

        // Reset original element
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            draggedElement.style.opacity = '';
            draggedElement.style.transform = '';
        }

        // Remove all drop target indicators
        document.querySelectorAll('.drop-target').forEach(el => {
            el.classList.remove('drop-target');
        });

        document.querySelectorAll('.drop-target-day').forEach(el => {
            el.classList.remove('drop-target-day');
        });

        // Remove event listeners
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('mouseleave', handleDragEnd);

        // Reset state
        setDraggingActivity(null);
        setDragSource(null);
        setDropTarget(null);
        setDraggedElement(null);
    };

    // Add a new activity
    const handleAddActivity = (dayIndex) => {
        const newActivity = {
            id: uuidv4(),
            time: "12:00",
            title: "New Activity",
            description: "Click to edit",
            type: "sightseeing",
            location: "",
            notes: ""
        };

        addActivity(dayIndex, newActivity);
    };

    // Generate the time options for the time picker
    const getTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const hourStr = hour.toString().padStart(2, '0');
                const minuteStr = minute.toString().padStart(2, '0');
                options.push(`${hourStr}:${minuteStr}`);
            }
        }
        return options;
    };

    return (
        <div className="itinerary-board" ref={boardRef}>
            <div className="itinerary-header">
                <h2>Trip Itinerary</h2>
                <p>Drag activities to reorder or move between days</p>
            </div>

            <div className="days-container">
                {trip.itinerary.map((day, dayIndex) => (
                    <DayCard
                        key={day.day}
                        day={day}
                        dayIndex={dayIndex}
                        className={loadedDays.includes(day.day) ? 'loaded' : 'not-loaded'}
                        style={{
                            animationDelay: `${dayIndex * 0.15}s`,
                            transitionDelay: `${dayIndex * 0.15}s`
                        }}
                    >
                        <div className="activities-container">
                            {day.activities.map((activity, activityIndex) => (
                                <ActivityItem
                                    key={activity.id}
                                    activity={activity}
                                    activityIndex={activityIndex}
                                    dayIndex={dayIndex}
                                    onDragStart={handleDragStart}
                                    onRemove={() => removeActivity(dayIndex, activity.id)}
                                    isDragging={draggingActivity && draggingActivity.id === activity.id}
                                    isDropTarget={
                                        dropTarget &&
                                        dropTarget.dayIndex === dayIndex &&
                                        dropTarget.activityIndex === activityIndex
                                    }
                                    timeOptions={getTimeOptions()}
                                />
                            ))}

                            <button
                                className="add-activity-btn"
                                onClick={() => handleAddActivity(dayIndex)}
                            >
                                <span className="plus-icon">+</span> Add Activity
                            </button>
                        </div>
                    </DayCard>
                ))}
            </div>
        </div>
    );
};

export default ItineraryBoard;