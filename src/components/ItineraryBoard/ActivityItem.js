import React, { useState, useRef } from 'react';
import { useTrip } from '../../context/TripContext';
import '../../styles/components/itinerary.css';

const ActivityItem = ({
                          activity,
                          activityIndex,
                          dayIndex,
                          onDragStart,
                          onRemove,
                          isDragging,
                          isDropTarget,
                          timeOptions
                      }) => {
    const { trip } = useTrip();
    const [isEditing, setIsEditing] = useState(false);
    const [editedActivity, setEditedActivity] = useState({ ...activity });
    const activityRef = useRef(null);

    // Activity types with icons
    const activityTypes = [
        { type: 'travel', icon: '✈️', label: 'Travel' },
        { type: 'food', icon: '🍴', label: 'Food' },
        { type: 'sightseeing', icon: '🏛️', label: 'Sightseeing' },
        { type: 'accommodation', icon: '🏨', label: 'Accommodation' },
        { type: 'shopping', icon: '🛍️', label: 'Shopping' },
        { type: 'activity', icon: '🎯', label: 'Activity' },
        { type: 'event', icon: '🎭', label: 'Event' },
        { type: 'other', icon: '📌', label: 'Other' }
    ];

    // Get icon for activity type
    const getActivityIcon = (type) => {
        const activityType = activityTypes.find(t => t.type === type);
        return activityType ? activityType.icon : '📌';
    };

    // Handle click to edit
    const handleClick = (e) => {
        // Avoid triggering edit mode when clicking drag handle
        if (e.target.closest('.drag-handle')) return;

        setIsEditing(true);
    };

    // Save edited activity
    const saveActivity = () => {
        // Update the activity in the trip context
        const updatedItinerary = [...trip.itinerary];
        updatedItinerary[dayIndex].activities[activityIndex] = editedActivity;

        // Would call the context update function here
        // updateActivity(dayIndex, activityIndex, editedActivity);

        setIsEditing(false);
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditedActivity({ ...activity });
        setIsEditing(false);
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedActivity(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Render edit form
    const renderEditForm = () => (
        <div className="activity-edit-form">
            <div className="form-row">
                <div className="form-group time-input">
                    <label htmlFor={`time-${activity.id}`}>Time</label>
                    <select
                        id={`time-${activity.id}`}
                        name="time"
                        value={editedActivity.time}
                        onChange={handleChange}
                    >
                        {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group type-input">
                    <label htmlFor={`type-${activity.id}`}>Type</label>
                    <select
                        id={`type-${activity.id}`}
                        name="type"
                        value={editedActivity.type}
                        onChange={handleChange}
                    >
                        {activityTypes.map(type => (
                            <option key={type.type} value={type.type}>
                                {type.icon} {type.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor={`title-${activity.id}`}>Title</label>
                <input
                    id={`title-${activity.id}`}
                    type="text"
                    name="title"
                    value={editedActivity.title}
                    onChange={handleChange}
                    placeholder="Activity title"
                />
            </div>

            <div className="form-group">
                <label htmlFor={`description-${activity.id}`}>Description</label>
                <input
                    id={`description-${activity.id}`}
                    type="text"
                    name="description"
                    value={editedActivity.description}
                    onChange={handleChange}
                    placeholder="Brief description"
                />
            </div>

            <div className="form-group">
                <label htmlFor={`location-${activity.id}`}>Location</label>
                <input
                    id={`location-${activity.id}`}
                    type="text"
                    name="location"
                    value={editedActivity.location}
                    onChange={handleChange}
                    placeholder="Location"
                />
            </div>

            <div className="form-group">
                <label htmlFor={`notes-${activity.id}`}>Notes</label>
                <textarea
                    id={`notes-${activity.id}`}
                    name="notes"
                    value={editedActivity.notes}
                    onChange={handleChange}
                    placeholder="Additional notes"
                    rows="3"
                ></textarea>
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-primary save-btn" onClick={saveActivity}>
                    Save
                </button>
                <button type="button" className="btn btn-secondary cancel-btn" onClick={cancelEditing}>
                    Cancel
                </button>
            </div>
        </div>
    );

    // Render activity display view
    const renderActivityView = () => (
        <>
            <div className="drag-handle"
                 onMouseDown={(e) => onDragStart(e, activity, dayIndex, activityIndex)}>
                <div className="drag-icon"></div>
            </div>

            <div className="activity-time">{activity.time}</div>

            <div className="activity-icon-container">
                <div className={`activity-icon ${activity.type}`} data-activity-type={activity.type}>
                    {getActivityIcon(activity.type)}
                </div>
            </div>

            <div className="activity-content">
                <h4 className="activity-title">{activity.title}</h4>
                {activity.description && (
                    <p className="activity-description">{activity.description}</p>
                )}
                {activity.location && (
                    <p className="activity-location">
                        <span className="location-icon">📍</span> {activity.location}
                    </p>
                )}
            </div>

            <div className="activity-actions">
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    <span className="edit-icon">✏️</span>
                </button>
                <button className="delete-btn" onClick={() => onRemove(activity.id)}>
                    <span className="delete-icon">🗑️</span>
                </button>
            </div>
        </>
    );

    return (
        <div
            className={`activity-item ${isEditing ? 'editing' : ''} ${isDragging ? 'dragging' : ''} ${isDropTarget ? 'drop-target' : ''}`}
            ref={activityRef}
            onClick={!isEditing ? handleClick : undefined}
            data-activity-index={activityIndex}
        >
            {isEditing ? renderEditForm() : renderActivityView()}
        </div>
    );
};

export default ActivityItem;