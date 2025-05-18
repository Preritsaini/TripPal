import { useState, useRef, useEffect } from 'react';

// Custom hook for drag and drop functionality
function useDragDrop({ onReorder, onMove }) {
    // State for tracking dragged item
    const [dragging, setDragging] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [sourceIndex, setSourceIndex] = useState(null);
    const [sourceDayIndex, setSourceDayIndex] = useState(null);

    // References for animation purposes
    const dragNodeRef = useRef();
    const dragPointRef = useRef({ x: 0, y: 0 });

    // Handle drag start
    const handleDragStart = (e, item, dayIndex, index) => {
        // Store drag start position for calculating drag offset
        dragPointRef.current = {
            x: e.clientX,
            y: e.clientY
        };

        // Store which item is being dragged
        setDraggedItem(item);
        setSourceIndex(index);
        setSourceDayIndex(dayIndex);

        // Used for creating ghost element and animations
        dragNodeRef.current = e.target;

        // Delay the dragging state to allow for initial animation
        setTimeout(() => {
            setDragging(true);
        }, 0);

        // Add event listeners for drag movement and end
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
    };

    // Handle drag movement (update UI)
    const handleDragMove = (e) => {
        // Only process if we're dragging something
        if (!dragging) return;

        // Calculate how far we've dragged from the original position
        const offsetX = e.clientX - dragPointRef.current.x;
        const offsetY = e.clientY - dragPointRef.current.y;

        // Apply transform to the dragged element
        if (dragNodeRef.current) {
            dragNodeRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            dragNodeRef.current.style.opacity = '0.8';
            dragNodeRef.current.style.zIndex = '1000';
        }
    };

    // Handle dropping an item
    const handleDragOver = (e, dayIndex, index) => {
        e.preventDefault();

        // Don't do anything if we're not dragging or this is the same position
        if (!dragging) return;
        if (dayIndex === sourceDayIndex && index === sourceIndex) return;

        // Different logic for reordering within the same day vs. moving between days
        if (dayIndex === sourceDayIndex) {
            // Reordering within the same day
            onReorder(dayIndex, sourceIndex, index);
            setSourceIndex(index);
        } else {
            // Moving between different days
            onMove(sourceDayIndex, dayIndex, sourceIndex);
            setSourceDayIndex(dayIndex);
            setSourceIndex(index);
        }
    };

    // Handle end of drag
    const handleDragEnd = () => {
        setDragging(false);
        setDraggedItem(null);
        setSourceIndex(null);
        setSourceDayIndex(null);

        // Reset styles on the dragged element
        if (dragNodeRef.current) {
            dragNodeRef.current.style.transform = '';
            dragNodeRef.current.style.opacity = '';
            dragNodeRef.current.style.zIndex = '';
            dragNodeRef.current = null;
        }

        // Remove event listeners
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
    };

    // Clean up event listeners when the component unmounts
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleDragMove);
            document.removeEventListener('mouseup', handleDragEnd);
        };
    }, []);

    return {
        dragging,
        draggedItem,
        handleDragStart,
        handleDragOver,
        handleDragEnd
    };
}

export default useDragDrop;