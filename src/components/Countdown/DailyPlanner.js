import React, { useState, useEffect, useRef } from 'react';
import { useTrip } from '../../context/TripContext';
import Button from '../common/AnimatedButton';
import Card from '../common/Card';
import Modal from '../common/Modal';
import '../styles/components/daily-planner.css';

const DailyPlanner = ({
                          date,
                          initialActivities = [],
                          onActivitiesChange,
                          dayIndex,
                          weather,
                          className = '',
                      }) => {
    const { destinations } = useTrip();
    const [activities, setActivities] = useState(initialActivities);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [draggingActivity, setDraggingActivity] = useState(null);
    const [dragOverHour, setDragOverHour] = useState(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const timeGridRef = useRef(null);

    const formatDate = (date) => {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const START_HOUR = 6; // 6 AM
    const END_HOUR = 24; // Midnight
    const HOUR_HEIGHT = 80; // Height of each hour block in pixels

    const timeBlocks = Array.from(
        { length: END_HOUR - START_HOUR },
        (_, i) => START_HOUR + i
    );

    const formatHour = (hour) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${displayHour} ${period}`;
    };

    const getActivityStyle = (activity) => {
        const startHour = parseFloat(activity.startTime);
        const endHour = parseFloat(activity.endTime);

        const top = (startHour - START_HOUR) * HOUR_HEIGHT;
        const height = (endHour - startHour) * HOUR_HEIGHT;

        return {
            top: `${top}px`,
            height: `${height}px`,
        };
    };

    const addActivity = (hour) => {
        setEditingActivity({
            id: null,
            title: '',
            location: '',
            description: '',
            startTime: hour,
            endTime: hour + 1,
            color: getRandomColor(),
        });
        setShowActivityModal(true);
    };

    const editActivity = (activity) => {
        setEditingActivity({ ...activity });
        setShowActivityModal(true);
    };

    const saveActivity = (activityData) => {
        const updatedActivities = [...activities];

        if (activityData.id) {
            const index = updatedActivities.findIndex(a => a.id === activityData.id);
            if (index !== -1) {
                updatedActivities[index] = activityData;
            }
        } else {

            const newActivity = {
                ...activityData,
                id: `activity-${Date.now()}`,
            };
            updatedActivities.push(newActivity);
        }

        setActivities(updatedActivities);
        setShowActivityModal(false);
        setEditingActivity(null);
        if (onActivitiesChange) {
            onActivitiesChange(updatedActivities);
        }
    };

    const deleteActivity = (activityId) => {
        const updatedActivities = activities.filter(a => a.id !== activityId);
        setActivities(updatedActivities);

        if (onActivitiesChange) {
            onActivitiesChange(updatedActivities);
        }
    };
    const getRandomColor = () => {
        const colors = [
            '#4F86F7', // Blue
            '#FF7849', // Coral
            '#6CD975', // Green
            '#FF5F85', // Pink
            '#9E7BFF', // Purple
            '#FFB347', // Orange
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleDragStart = (e, activity) => {
        setDraggingActivity(activity);
        // Add a ghost image for better drag visual
        const ghostImage = document.createElement('div');
        ghostImage.classList.add('tb-daily-planner__drag-ghost');
        ghostImage.textContent = activity.title;
        ghostImage.style.backgroundColor = activity.color;
        document.body.appendChild(ghostImage);
        e.dataTransfer.setDragImage(ghostImage, 0, 0);

        setTimeout(() => {
            document.body.removeChild(ghostImage);
        }, 0);
    };

    // Handle drag over
    const handleDragOver = (e, hour) => {
        e.preventDefault();
        setDragOverHour(hour);
    };

    // Handle drop
    const handleDrop = (e, dropHour) => {
        e.preventDefault();

        if (!draggingActivity) return;

        const updatedActivities = [...activities];
        const index = updatedActivities.findIndex(a => a.id === draggingActivity.id);

        if (index !== -1) {
            // Calculate the duration of the activity
            const duration = parseFloat(draggingActivity.endTime) - parseFloat(draggingActivity.startTime);

            // Update the start and end times
            updatedActivities[index] = {
                ...updatedActivities[index],
                startTime: dropHour,
                endTime: dropHour + duration,
            };

            setActivities(updatedActivities);

            // Notify parent of change
            if (onActivitiesChange) {
                onActivitiesChange(updatedActivities);
            }
        }

        setDraggingActivity(null);
        setDragOverHour(null);
    };

    // Get time from pixel position (for resizing)
    const getTimeFromPosition = (posY) => {
        if (!timeGridRef.current) return null;

        const rect = timeGridRef.current.getBoundingClientRect();
        const relativeY = posY - rect.top;

        // Calculate the hour based on the position
        let hour = START_HOUR + (relativeY / HOUR_HEIGHT);

        // Round to nearest quarter hour
        hour = Math.round(hour * 4) / 4;

        // Keep within bounds
        hour = Math.max(START_HOUR, Math.min(END_HOUR, hour));

        return hour;
    };

    // Sort activities by start time
    const sortedActivities = [...activities].sort((a, b) =>
        parseFloat(a.startTime) - parseFloat(b.startTime)
    );

    // Weather icon mapping (using ASCII for no custom assets)
    const getWeatherIcon = (condition) => {
        if (!condition) return '?';

        const conditionLower = condition.toLowerCase();

        if (conditionLower.includes('sun') || conditionLower.includes('clear')) return '☀️';
        if (conditionLower.includes('cloud')) return '☁️';
        if (conditionLower.includes('rain')) return '🌧️';
        if (conditionLower.includes('snow')) return '❄️';
        if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⚡';
        if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
        if (conditionLower.includes('wind')) return '💨';

        return '🌡️';
    };

    return (
        <Card
            variant="elevated"
            className={`tb-daily-planner ${className} ${isExpanded ? 'tb-daily-planner--expanded' : 'tb-daily-planner--collapsed'}`}
            animation="none"
        >
            <div className="tb-daily-planner__header">
                <div className="tb-daily-planner__date-badge">
                    <span className="tb-daily-planner__day-number">{date.getDate()}</span>
                    <span className="tb-daily-planner__month">{date.toLocaleString('default', { month: 'short' })}</span>
                </div>

                <div className="tb-daily-planner__header-content">
                    <h3 className="tb-daily-planner__header-title">
                        Day {dayIndex + 1}: {formatDate(date)}
                    </h3>

                    {weather && (
                        <div className="tb-daily-planner__weather">
              <span className="tb-daily-planner__weather-icon">
                {getWeatherIcon(weather.condition)}
              </span>
                            <span className="tb-daily-planner__weather-temp">
                {weather.temperature}°
              </span>
                            <span className="tb-daily-planner__weather-condition">
                {weather.condition}
              </span>
                        </div>
                    )}
                </div>

                <button
                    className="tb-daily-planner__toggle-button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label={isExpanded ? 'Collapse day planner' : 'Expand day planner'}
                >
                    {isExpanded ? '▲' : '▼'}
                </button>
            </div>

            {isExpanded && (
                <div className="tb-daily-planner__content">
                    <div className="tb-daily-planner__destination-label">
                        {destinations && destinations[dayIndex] && (
                            <div className="tb-daily-planner__destination">
                                <span className="tb-daily-planner__destination-icon">📍</span>
                                {destinations[dayIndex]}
                            </div>
                        )}
                    </div>

                    <div className="tb-daily-planner__schedule">
                        <div className="tb-daily-planner__time-labels">
                            {timeBlocks.map(hour => (
                                <div key={hour} className="tb-daily-planner__time-label">
                                    {formatHour(hour)}
                                </div>
                            ))}
                        </div>

                        <div
                            ref={timeGridRef}
                            className="tb-daily-planner__time-grid"
                        >
                            {timeBlocks.map(hour => (
                                <div
                                    key={hour}
                                    className={`tb-daily-planner__hour-block ${dragOverHour === hour ? 'tb-daily-planner__hour-block--drag-over' : ''}`}
                                    onClick={() => addActivity(hour)}
                                    onDragOver={(e) => handleDragOver(e, hour)}
                                    onDrop={(e) => handleDrop(e, hour)}
                                >
                                    <div className="tb-daily-planner__hour-label">{formatHour(hour)}</div>
                                </div>
                            ))}

                            {sortedActivities.map(activity => (
                                <div
                                    key={activity.id}
                                    className="tb-daily-planner__activity"
                                    style={{
                                        ...getActivityStyle(activity),
                                        backgroundColor: activity.color,
                                    }}
                                    onClick={() => editActivity(activity)}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, activity)}
                                >
                                    <div className="tb-daily-planner__activity-time">
                                        {formatHour(parseFloat(activity.startTime))} - {formatHour(parseFloat(activity.endTime))}
                                    </div>
                                    <div className="tb-daily-planner__activity-title">
                                        {activity.title}
                                    </div>
                                    {activity.location && (
                                        <div className="tb-daily-planner__activity-location">
                                            {activity.location}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="tb-daily-planner__actions">
                        <Button
                            variant="outline"
                            size="small"
                            onClick={() => addActivity(9)} // Default to 9 AM
                        >
                            Add Activity
                        </Button>
                    </div>
                </div>
            )}

            {/* Activity Edit Modal */}
            <Modal
                isOpen={showActivityModal}
                onClose={() => {
                    setShowActivityModal(false);
                    setEditingActivity(null);
                }}
                title={editingActivity?.id ? 'Edit Activity' : 'Add Activity'}
                size="medium"
                animation="slide"
                footer={
                    <div className="tb-daily-planner__modal-footer">
                        {editingActivity?.id && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    deleteActivity(editingActivity.id);
                                    setShowActivityModal(false);
                                }}
                                className="tb-daily-planner__delete-button"
                            >
                                Delete
                            </Button>
                        )}
                        <Button
                            variant="text"
                            onClick={() => {
                                setShowActivityModal(false);
                                setEditingActivity(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                if (editingActivity) {
                                    saveActivity(editingActivity);
                                }
                            }}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                {editingActivity && (
                    <div className="tb-daily-planner__activity-form">
                        <div className="tb-daily-planner__form-group">
                            <label className="tb-daily-planner__form-label">
                                Activity Title
                            </label>
                            <input
                                type="text"
                                className="tb-daily-planner__form-input"
                                value={editingActivity.title}
                                onChange={(e) => setEditingActivity({
                                    ...editingActivity,
                                    title: e.target.value
                                })}
                                placeholder="Enter activity title"
                            />
                        </div>

                        <div className="tb-daily-planner__form-row">
                            <div className="tb-daily-planner__form-group">
                                <label className="tb-daily-planner__form-label">
                                    Start Time
                                </label>
                                <select
                                    className="tb-daily-planner__form-select"
                                    value={editingActivity.startTime}
                                    onChange={(e) => {
                                        const newStartTime = parseFloat(e.target.value);
                                        const endTime = parseFloat(editingActivity.endTime);

                                        // Adjust end time if necessary
                                        const newEndTime = newStartTime >= endTime ?
                                            newStartTime + 0.5 : endTime;

                                        setEditingActivity({
                                            ...editingActivity,
                                            startTime: newStartTime,
                                            endTime: newEndTime
                                        });
                                    }}
                                >
                                    {Array.from({ length: (END_HOUR - START_HOUR) * 4 }, (_, i) => {
                                        const hour = START_HOUR + (i / 4);
                                        const minutes = (i % 4) * 15;
                                        const period = hour >= 12 ? 'PM' : 'AM';
                                        const displayHour = Math.floor(hour) % 12 === 0 ? 12 : Math.floor(hour) % 12;
                                        return (
                                            <option key={hour} value={hour}>
                                                {displayHour}:{minutes.toString().padStart(2, '0')} {period}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="tb-daily-planner__form-group">
                                <label className="tb-daily-planner__form-label">
                                    End Time
                                </label>
                                <select
                                    className="tb-daily-planner__form-select"
                                    value={editingActivity.endTime}
                                    onChange={(e) => setEditingActivity({
                                        ...editingActivity,
                                        endTime: parseFloat(e.target.value)
                                    })}
                                >
                                    {Array.from({ length: (END_HOUR - START_HOUR) * 4 }, (_, i) => {
                                        const hour = START_HOUR + (i / 4);
                                        // Only show end times that are after the start time
                                        if (hour <= parseFloat(editingActivity.startTime)) return null;

                                        const minutes = (i % 4) * 15;
                                        const period = hour >= 12 ? 'PM' : 'AM';
                                        const displayHour = Math.floor(hour) % 12 === 0 ? 12 : Math.floor(hour) % 12;
                                        return (
                                            <option key={hour} value={hour}>
                                                {displayHour}:{minutes.toString().padStart(2, '0')} {period}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="tb-daily-planner__form-group">
                            <label className="tb-daily-planner__form-label">
                                Location
                            </label>
                            <input
                                type="text"
                                className="tb-daily-planner__form-input"
                                value={editingActivity.location || ''}
                                onChange={(e) => setEditingActivity({
                                    ...editingActivity,
                                    location: e.target.value
                                })}
                                placeholder="Enter location (optional)"
                            />
                        </div>

                        <div className="tb-daily-planner__form-group">
                            <label className="tb-daily-planner__form-label">
                                Description
                            </label>
                            <textarea
                                className="tb-daily-planner__form-textarea"
                                value={editingActivity.description || ''}
                                onChange={(e) => setEditingActivity({
                                    ...editingActivity,
                                    description: e.target.value
                                })}
                                placeholder="Enter activity description (optional)"
                                rows={3}
                            />
                        </div>

                        <div className="tb-daily-planner__form-group">
                            <label className="tb-daily-planner__form-label">
                                Color
                            </label>
                            <div className="tb-daily-planner__color-picker">
                                {['#4F86F7', '#FF7849', '#6CD975', '#FF5F85', '#9E7BFF', '#FFB347'].map(color => (
                                    <button
                                        key={color}
                                        className={`tb-daily-planner__color-option ${editingActivity.color === color ? 'tb-daily-planner__color-option--selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setEditingActivity({
                                            ...editingActivity,
                                            color
                                        })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default DailyPlanner;