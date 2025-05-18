import React, { createContext, useContext, useState, useEffect } from 'react';
import { demoTrip } from '../utils/demoData';

// Create context
const TripContext = createContext();

// Custom hook to use the trip context
export const useTrip = () => {
    return useContext(TripContext);
};

// Provider component
export const TripProvider = ({ children }) => {
    // Initialize state with localStorage data or demo data
    const [trip, setTrip] = useState(() => {
        const savedTrip = localStorage.getItem('tripData');
        return savedTrip ? JSON.parse(savedTrip) : demoTrip;
    });

    // Save to localStorage whenever trip changes
    useEffect(() => {
        localStorage.setItem('tripData', JSON.stringify(trip));
    }, [trip]);

    // Update trip destination
    const updateDestination = (destination) => {
        setTrip(prev => ({
            ...prev,
            destination
        }));
    };

    // Update trip dates
    const updateDates = (startDate, endDate) => {
        setTrip(prev => ({
            ...prev,
            startDate,
            endDate
        }));
    };

    // Add activity to itinerary
    const addActivity = (dayIndex, activity) => {
        setTrip(prev => {
            const newItinerary = [...prev.itinerary];
            newItinerary[dayIndex] = {
                ...newItinerary[dayIndex],
                activities: [...newItinerary[dayIndex].activities, activity]
            };
            return {
                ...prev,
                itinerary: newItinerary
            };
        });
    };

    // Remove activity from itinerary
    const removeActivity = (dayIndex, activityId) => {
        setTrip(prev => {
            const newItinerary = [...prev.itinerary];
            newItinerary[dayIndex] = {
                ...newItinerary[dayIndex],
                activities: newItinerary[dayIndex].activities.filter(
                    activity => activity.id !== activityId
                )
            };
            return {
                ...prev,
                itinerary: newItinerary
            };
        });
    };

    // Reorder activities within a day
    const reorderActivities = (dayIndex, startIndex, endIndex) => {
        setTrip(prev => {
            const newItinerary = [...prev.itinerary];
            const [removed] = newItinerary[dayIndex].activities.splice(startIndex, 1);
            newItinerary[dayIndex].activities.splice(endIndex, 0, removed);
            return {
                ...prev,
                itinerary: newItinerary
            };
        });
    };

    // Move activity between days
    const moveActivity = (sourceDayIndex, destinationDayIndex, activityIndex) => {
        setTrip(prev => {
            const newItinerary = [...prev.itinerary];
            const activity = newItinerary[sourceDayIndex].activities[activityIndex];

            // Remove from source day
            newItinerary[sourceDayIndex].activities.splice(activityIndex, 1);

            // Add to destination day
            newItinerary[destinationDayIndex].activities.push(activity);

            return {
                ...prev,
                itinerary: newItinerary
            };
        });
    };

    // Update packing list item
    const togglePackingItem = (itemId) => {
        setTrip(prev => {
            const newPackingList = prev.packingList.map(item =>
                item.id === itemId ? { ...item, packed: !item.packed } : item
            );
            return {
                ...prev,
                packingList: newPackingList
            };
        });
    };

    // Add packing list item
    const addPackingItem = (item) => {
        setTrip(prev => ({
            ...prev,
            packingList: [...prev.packingList, item]
        }));
    };

    // Remove packing list item
    const removePackingItem = (itemId) => {
        setTrip(prev => ({
            ...prev,
            packingList: prev.packingList.filter(item => item.id !== itemId)
        }));
    };

    // Reset trip (use demo data)
    const resetTrip = () => {
        setTrip(demoTrip);
    };

    // Export trip data
    const exportTrip = () => {
        const dataStr = JSON.stringify(trip);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `${trip.destination.replace(/\s+/g, '-')}-trip-plan.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Import trip data
    const importTrip = (data) => {
        try {
            const tripData = JSON.parse(data);
            setTrip(tripData);
            return true;
        } catch (error) {
            console.error("Failed to import trip data:", error);
            return false;
        }
    };

    const value = {
        trip,
        updateDestination,
        updateDates,
        addActivity,
        removeActivity,
        reorderActivities,
        moveActivity,
        togglePackingItem,
        addPackingItem,
        removePackingItem,
        resetTrip,
        exportTrip,
        importTrip
    };

    return (
        <TripContext.Provider value={value}>
            {children}
        </TripContext.Provider>
    );
};