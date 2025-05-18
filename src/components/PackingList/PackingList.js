import React, { useState, useEffect, useRef } from 'react';
import { useTrip } from '../../context/TripContext';
import CategoryTabs from './CategoryTabs';
import ChecklistItem from './ChecklistItem';
import ProgressIndicator from './ProgressIndicator';
import { v4 as uuidv4 } from 'uuid';
import '../../styles/components/packingList.css';

const PackingList = () => {
    const { trip, togglePackingItem, addPackingItem, removePackingItem } = useTrip();
    const [activeCategory, setActiveCategory] = useState('all');
    const [filteredItems, setFilteredItems] = useState([]);
    const [showCompleted, setShowCompleted] = useState(true);
    const [sortBy, setSortBy] = useState('category');
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('essentials');
    const [newItemPriority, setNewItemPriority] = useState('medium');
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [animatingItems, setAnimatingItems] = useState([]);
    const packingListRef = useRef(null);

    // Categories for tabs and new items
    const categories = [
        { id: 'all', label: 'All Items', icon: '📋' },
        { id: 'essentials', label: 'Essentials', icon: '🔑' },
        { id: 'clothing', label: 'Clothing', icon: '👕' },
        { id: 'electronics', label: 'Electronics', icon: '📱' },
        { id: 'toiletries', label: 'Toiletries', icon: '🧼' },
        { id: 'health', label: 'Health', icon: '💊' },
        { id: 'comfort', label: 'Comfort', icon: '🛌' }
    ];

    // Priority options
    const priorities = [
        { id: 'high', label: 'High', icon: '🔴' },
        { id: 'medium', label: 'Medium', icon: '🟠' },
        { id: 'low', label: 'Low', icon: '🟢' }
    ];

    // Filter items based on active category and show completed setting
    useEffect(() => {
        let items = [...trip.packingList];

        // Filter by category
        if (activeCategory !== 'all') {
            items = items.filter(item => item.category === activeCategory);
        }

        // Filter by completion status
        if (!showCompleted) {
            items = items.filter(item => !item.packed);
        }

        // Sort items
        if (sortBy === 'category') {
            items.sort((a, b) => a.category.localeCompare(b.category));
        } else if (sortBy === 'priority') {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            items.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else if (sortBy === 'name') {
            items.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'status') {
            items.sort((a, b) => (a.packed === b.packed) ? 0 : a.packed ? 1 : -1);
        }

        setFilteredItems(items);
    }, [trip.packingList, activeCategory, showCompleted, sortBy]);

    // Add a new item
    const handleAddItem = () => {
        if (newItemName.trim() === '') return;

        const newItem = {
            id: uuidv4(),
            name: newItemName.trim(),
            category: newItemCategory,
            packed: false,
            priority: newItemPriority
        };

        addPackingItem(newItem);

        // Add to animating items for entrance animation
        setAnimatingItems(prev => [...prev, newItem.id]);

        // Clear form
        setNewItemName('');
        setIsAddingItem(false);

        // Remove from animating items after animation completes
        setTimeout(() => {
            setAnimatingItems(prev => prev.filter(id => id !== newItem.id));
        }, 1000);
    };

    // Toggle item packed status with animation
    const handleToggleItem = (itemId) => {
        togglePackingItem(itemId);

        // Find the item to check if it's being marked as complete
        const item = trip.packingList.find(item => item.id === itemId);

        if (item && !item.packed) {
            // Item is being marked as complete, show confetti
            showConfetti();
        }
    };

    // Show confetti animation
    const showConfetti = () => {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);

        // Create confetti pieces
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            // Randomize confetti properties
            const size = 5 + Math.random() * 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const animationDuration = 3 + Math.random() * 2;
            const animationDelay = Math.random() * 0.5;

            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.left = `${left}%`;
            confetti.style.animationDuration = `${animationDuration}s`;
            confetti.style.animationDelay = `${animationDelay}s`;

            confettiContainer.appendChild(confetti);
        }

        // Remove confetti after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    };

    // Calculate progress percentage
    const calculateProgress = () => {
        const totalItems = trip.packingList.length;
        if (totalItems === 0) return 0;

        const packedItems = trip.packingList.filter(item => item.packed).length;
        return Math.round((packedItems / totalItems) * 100);
    };

    // Get category label from id
    const getCategoryLabel = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.label : categoryId;
    };

    // Get priority label from id
    const getPriorityLabel = (priorityId) => {
        const priority = priorities.find(p => p.id === priorityId);
        return priority ? priority.label : priorityId;
    };

    return (
        <div className="packing-list" ref={packingListRef}>
            <div className="packing-list-header">
                <h2>Packing List</h2>

                <ProgressIndicator
                    progress={calculateProgress()}
                    totalItems={trip.packingList.length}
                    packedItems={trip.packingList.filter(item => item.packed).length}
                />
            </div>

            <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            <div className="packing-list-actions">
                <div className="filter-actions">
                    <div className="toggle-container">
                        <input
                            type="checkbox"
                            id="show-completed"
                            checked={showCompleted}
                            onChange={() => setShowCompleted(!showCompleted)}
                        />
                        <label htmlFor="show-completed" className="toggle-label">
                            Show Packed Items
                        </label>
                    </div>

                    <div className="sort-container">
                        <label htmlFor="sort-by">Sort by:</label>
                        <select
                            id="sort-by"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="category">Category</option>
                            <option value="priority">Priority</option>
                            <option value="name">Name</option>
                            <option value="status">Status</option>
                        </select>
                    </div>
                </div>

                <button
                    className="add-item-btn"
                    onClick={() => setIsAddingItem(true)}
                >
                    <span className="plus-icon">+</span> Add Item
                </button>
            </div>

            {/* Add new item form */}
            {isAddingItem && (
                <div className="add-item-form">
                    <div className="form-header">
                        <h3>Add New Item</h3>
                        <button
                            className="close-form-btn"
                            onClick={() => setIsAddingItem(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="item-name">Item Name</label>
                            <input
                                id="item-name"
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="e.g., Passport, Phone Charger"
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="item-category">Category</label>
                            <select
                                id="item-category"
                                value={newItemCategory}
                                onChange={(e) => setNewItemCategory(e.target.value)}
                            >
                                {categories.filter(cat => cat.id !== 'all').map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.icon} {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="item-priority">Priority</label>
                            <select
                                id="item-priority"
                                value={newItemPriority}
                                onChange={(e) => setNewItemPriority(e.target.value)}
                            >
                                {priorities.map(priority => (
                                    <option key={priority.id} value={priority.id}>
                                        {priority.icon} {priority.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            className="btn btn-primary"
                            onClick={handleAddItem}
                            disabled={!newItemName.trim()}
                        >
                            Add to Packing List
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsAddingItem(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Items list */}
            <div className="items-list">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <ChecklistItem
                            key={item.id}
                            item={item}
                            onToggle={() => handleToggleItem(item.id)}
                            onRemove={() => removePackingItem(item.id)}
                            categoryLabel={getCategoryLabel(item.category)}
                            priorityLabel={getPriorityLabel(item.priority)}
                            isAnimating={animatingItems.includes(item.id)}
                        />
                    ))
                ) : (
                    <div className="empty-list">
                        <div className="empty-icon">📋</div>
                        {trip.packingList.length === 0 ? (
                            <p>Your packing list is empty. Add some items to get started!</p>
                        ) : (
                            <p>No items match your current filters.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PackingList;