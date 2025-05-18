import React, { useState, useEffect } from 'react';
import '/home/prerit/WebstormProjects/codecircuitproj/src/styles/components/date-selector.css';

const DateSelector = ({
                          mode = 'single',
                          initialDate = null,
                          onChange,
                          minDate = null,
                          maxDate = null,
                          showWeekNumbers = false,
                          enableAnimation = true,
                          highlightDates = [],
                          className = '',
                      }) => {
    // Convert initialDate to state
    const getInitialDateState = () => {
        if (!initialDate) {
            return mode === 'single' ? null : [];
        }
        return initialDate;
    };

    const [selectedDate, setSelectedDate] = useState(getInitialDateState());
    const [currentMonth, setCurrentMonth] = useState(initialDate ?
        (mode === 'single' ? initialDate.getMonth() : initialDate[0]?.getMonth()) || new Date().getMonth()
        : new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(initialDate ?
        (mode === 'single' ? initialDate.getFullYear() : initialDate[0]?.getFullYear()) || new Date().getFullYear()
        : new Date().getFullYear());
    const [animationDirection, setAnimationDirection] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [hoverDate, setHoverDate] = useState(null);

    // Day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Format a date as YYYY-MM-DD
    const formatDateString = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Check if a date is selected
    const isDateSelected = (date) => {
        if (!selectedDate) return false;

        const dateString = formatDateString(date);

        if (mode === 'single') {
            return selectedDate && formatDateString(selectedDate) === dateString;
        } else if (mode === 'range' && selectedDate.length === 2) {
            const startDate = selectedDate[0];
            const endDate = selectedDate[1];

            if (!startDate || !endDate) return false;

            return date >= startDate && date <= endDate;
        } else if (mode === 'multiple') {
            return selectedDate.some(d => formatDateString(d) === dateString);
        }

        return false;
    };

    // Check if a date is in range (for hover effect in range mode)
    const isDateInRange = (date) => {
        if (mode !== 'range' || !selectedDate || selectedDate.length !== 1 || !hoverDate) {
            return false;
        }

        const startDate = selectedDate[0];
        const endDate = hoverDate;

        return date > startDate && date < endDate;
    };

    // Check if a date is the start date in range mode
    const isStartDate = (date) => {
        if (mode !== 'range' || !selectedDate || selectedDate.length === 0) {
            return false;
        }

        return formatDateString(date) === formatDateString(selectedDate[0]);
    };

    // Check if a date is the end date in range mode
    const isEndDate = (date) => {
        if (mode !== 'range' || !selectedDate || selectedDate.length !== 2) {
            return false;
        }

        return formatDateString(date) === formatDateString(selectedDate[1]);
    };

    // Check if a date is highlighted
    const isHighlighted = (date) => {
        return highlightDates.includes(formatDateString(date));
    };

    // Check if a date is today
    const isToday = (date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // Check if a date is disabled
    const isDisabled = (date) => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const days = [];

        // Get the first day of the month
        const firstDay = new Date(currentYear, currentMonth, 1);
        const firstDayOfWeek = firstDay.getDay();

        // Get the last day of the month
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Get the last day of the previous month
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

        // Add previous month's days
        for (let i = 0; i < firstDayOfWeek; i++) {
            const date = new Date(currentYear, currentMonth - 1, prevMonthLastDay - firstDayOfWeek + i + 1);
            days.push({
                date,
                day: date.getDate(),
                isCurrentMonth: false,
                isPrevMonth: true,
                isNextMonth: false
            });
        }

        // Add current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentYear, currentMonth, i);
            days.push({
                date,
                day: i,
                isCurrentMonth: true,
                isPrevMonth: false,
                isNextMonth: false
            });
        }

        // Add next month's days to fill the remaining slots
        const remainingSlots = 42 - days.length; // 6 rows x 7 days

        for (let i = 1; i <= remainingSlots; i++) {
            const date = new Date(currentYear, currentMonth + 1, i);
            days.push({
                date,
                day: i,
                isCurrentMonth: false,
                isPrevMonth: false,
                isNextMonth: true
            });
        }

        return days;
    };

    // Calculate week numbers
    const getWeekNumber = (date) => {
        const target = new Date(date.valueOf());
        const dayNr = (date.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        const firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
        }
        return 1 + Math.ceil((firstThursday - target) / 604800000);
    };

    // Group days by week (for week number rendering)
    const groupDaysByWeek = (days) => {
        const weeks = [];
        let week = [];

        days.forEach((day, index) => {
            week.push(day);

            if ((index + 1) % 7 === 0) {
                weeks.push(week);
                week = [];
            }
        });

        return weeks;
    };

    // Go to the previous month
    const goToPrevMonth = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setAnimationDirection('slide-right');

        setTimeout(() => {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
            } else {
                setCurrentMonth(currentMonth - 1);
            }

            setIsAnimating(false);
        }, 300);
    };

    // Go to the next month
    const goToNextMonth = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setAnimationDirection('slide-left');

        setTimeout(() => {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                setCurrentMonth(currentMonth + 1);
            }

            setIsAnimating(false);
        }, 300);
    };

    // Handle date selection
    const handleDateSelect = (day) => {
        if (isDisabled(day.date)) return;

        let newSelectedDate;

        if (mode === 'single') {
            newSelectedDate = day.date;
        } else if (mode === 'range') {
            if (!selectedDate || selectedDate.length === 0 || selectedDate.length === 2) {
                newSelectedDate = [day.date];
            } else {
                // If we already have a start date
                const startDate = selectedDate[0];

                // Make sure end date is after start date
                if (day.date < startDate) {
                    newSelectedDate = [day.date, startDate];
                } else {
                    newSelectedDate = [...selectedDate, day.date];
                }
            }
        } else if (mode === 'multiple') {
            newSelectedDate = [...selectedDate];

            // Check if the date is already selected
            const dateString = formatDateString(day.date);
            const index = newSelectedDate.findIndex(d => formatDateString(d) === dateString);

            if (index !== -1) {
                // If the date is already selected, remove it
                newSelectedDate.splice(index, 1);
            } else {
                // If the date is not selected, add it
                newSelectedDate.push(day.date);
            }
        }

        setSelectedDate(newSelectedDate);

        if (onChange) {
            onChange(newSelectedDate);
        }
    };

    // Handle hover in range mode
    const handleDateHover = (day) => {
        if (mode === 'range' && selectedDate && selectedDate.length === 1) {
            setHoverDate(day.date);
        }
    };

    // Update the calendar when selectedDate changes
    useEffect(() => {
        if (!selectedDate) return;

        const date = mode === 'single' ? selectedDate : selectedDate[0];

        if (date) {
            setCurrentMonth(date.getMonth());
            setCurrentYear(date.getFullYear());
        }
    }, []);

    // Generate calendar
    const calendarDays = generateCalendarDays();
    const calendarWeeks = showWeekNumbers ? groupDaysByWeek(calendarDays) : null;

    return (
        <div className={`tb-date-selector ${className}`}>
            <div className="tb-date-selector__header">
                <button
                    type="button"
                    className="tb-date-selector__nav-button"
                    onClick={goToPrevMonth}
                    aria-label="Previous month"
                >
                    <span className="tb-date-selector__nav-icon">&#10094;</span>
                </button>

                <div className="tb-date-selector__header-label">
                    {monthNames[currentMonth]} {currentYear}
                </div>

                <button
                    type="button"
                    className="tb-date-selector__nav-button"
                    onClick={goToNextMonth}
                    aria-label="Next month"
                >
                    <span className="tb-date-selector__nav-icon">&#10095;</span>
                </button>
            </div>

            <div className="tb-date-selector__calendar">
                <div className="tb-date-selector__days-header">
                    {showWeekNumbers && <div className="tb-date-selector__week-number-header">W</div>}

                    {dayNames.map((day, index) => (
                        <div key={index} className="tb-date-selector__day-name">
                            {day}
                        </div>
                    ))}
                </div>

                <div
                    className={`tb-date-selector__days-grid ${enableAnimation ? `tb-date-selector__days-grid--${animationDirection}` : ''}`}
                >
                    {showWeekNumbers ? (
                        calendarWeeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="tb-date-selector__week">
                                <div className="tb-date-selector__week-number">
                                    {getWeekNumber(week[0].date)}
                                </div>

                                {week.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={`
                      tb-date-selector__day
                      ${day.isCurrentMonth ? '' : 'tb-date-selector__day--faded'}
                      ${isDateSelected(day.date) ? 'tb-date-selector__day--selected' : ''}
                      ${isToday(day.date) ? 'tb-date-selector__day--today' : ''}
                      ${isHighlighted(day.date) ? 'tb-date-selector__day--highlighted' : ''}
                      ${isDisabled(day.date) ? 'tb-date-selector__day--disabled' : ''}
                      ${isStartDate(day.date) ? 'tb-date-selector__day--range-start' : ''}
                      ${isEndDate(day.date) ? 'tb-date-selector__day--range-end' : ''}
                      ${isDateInRange(day.date) ? 'tb-date-selector__day--in-range' : ''}
                    `}
                                        onClick={() => handleDateSelect(day)}
                                        onMouseEnter={() => handleDateHover(day)}
                                    >
                                        <span className="tb-date-selector__day-number">{day.day}</span>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        calendarDays.map((day, index) => (
                            <div
                                key={index}
                                className={`
                  tb-date-selector__day
                  ${day.isCurrentMonth ? '' : 'tb-date-selector__day--faded'}
                  ${isDateSelected(day.date) ? 'tb-date-selector__day--selected' : ''}
                  ${isToday(day.date) ? 'tb-date-selector__day--today' : ''}
                  ${isHighlighted(day.date) ? 'tb-date-selector__day--highlighted' : ''}
                  ${isDisabled(day.date) ? 'tb-date-selector__day--disabled' : ''}
                  ${isStartDate(day.date) ? 'tb-date-selector__day--range-start' : ''}
                  ${isEndDate(day.date) ? 'tb-date-selector__day--range-end' : ''}
                  ${isDateInRange(day.date) ? 'tb-date-selector__day--in-range' : ''}
                `}
                                onClick={() => handleDateSelect(day)}
                                onMouseEnter={() => handleDateHover(day)}
                            >
                                <span className="tb-date-selector__day-number">{day.day}</span>
                            </div>
                        ))
                    )}
                </div>

                {mode === 'range' && selectedDate && selectedDate.length === 1 && (
                    <div className="tb-date-selector__helper-text">
                        Select end date
                    </div>
                )}
            </div>
        </div>
    );
};

export default DateSelector;