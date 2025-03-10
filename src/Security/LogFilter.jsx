import React, { useState } from 'react';
import PropTypes from 'prop-types';

function LogFilter({ onFilterChange }) {
    const [eventType, setEventType] = useState('');
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const newErrors = {};
        
        // Simple validation example - you can add more complex validation if needed
        if (eventType && !/^[a-zA-Z0-9_.-]+$/.test(eventType)) {
            newErrors.eventType = 'Event type can only contain alphanumeric characters, dots, underscores, and hyphens';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearch = () => {
        if (validateInputs()) {
            onFilterChange({ eventType, date });
        }
    };

    const handleReset = () => {
        setEventType('');
        setDate('');
        onFilterChange({});
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-medium mb-3">Filter Logs</h2>
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Type
                    </label>
                    <input 
                        id="eventType"
                        className={`border ${errors.eventType ? 'border-red-500' : 'border-gray-300'} p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Search by event type..." 
                        value={eventType} 
                        onChange={(e) => setEventType(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {errors.eventType && (
                        <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>
                    )}
                </div>
                
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                    </label>
                    <input 
                        id="date"
                        className="border border-gray-300 p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="flex gap-2">
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleSearch}
                >
                    Search
                </button>
                <button 
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

LogFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired
};

export default LogFilter;