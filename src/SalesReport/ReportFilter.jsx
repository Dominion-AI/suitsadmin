import React, { useState, useEffect } from "react";

function ReportFilter({ filters, setFilters, onFilterApply, users = [], categories = [] }) {
    const [error, setError] = useState("");
    const [activeRange, setActiveRange] = useState("");

    // Quick date range presets
    const setQuickDateRange = (range) => {
        const today = new Date();
        let startDate = "";
        let endDate = today.toISOString().split("T")[0];

        switch (range) {
            case "today":
                startDate = endDate;
                break;
            case "last7days":
                startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split("T")[0];
                break;
            case "thisMonth":
                startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
                break;
            case "lastMonth":
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split("T")[0];
                endDate = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split("T")[0];
                break;
            case "lastQuarter":
                const quarter = Math.floor(today.getMonth() / 3) - 1;
                startDate = new Date(today.getFullYear(), quarter * 3, 1).toISOString().split("T")[0];
                endDate = new Date(today.getFullYear(), quarter * 3 + 3, 0).toISOString().split("T")[0];
                break;
            case "thisYear":
                startDate = new Date(today.getFullYear(), 0, 1).toISOString().split("T")[0];
                break;
            default:
                break;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            startDate,
            endDate,
        }));
        setActiveRange(range);
        setError("");
    };

    // Validate filters
    const validateFilters = () => {
        if (!filters.startDate || !filters.endDate) {
            setError("Start date and end date are required.");
            return false;
        }
        if (filters.startDate > filters.endDate) {
            setError("Start date cannot be after end date.");
            return false;
        }
        setError("");
        return true;
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
        
        // Reset active range when dates are manually changed
        if (name === "startDate" || name === "endDate") {
            setActiveRange("");
        }
    };

    // Apply filters
    const handleApplyFilters = () => {
        if (!validateFilters()) return;
        onFilterApply(); // This matches the prop name from SalesReportViewer
    };

    // Clear filters
    const handleClearFilters = () => {
        setFilters({
            startDate: "",
            endDate: "",
            user: "",
            category: "",
        });
        setActiveRange("");
        setError("");
    };

    // Format date for display
    const formatDateDisplay = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                    </svg>
                    Filter Your Report
                </h2>
                
                {/* Date summary */}
                {filters.startDate && filters.endDate && (
                    <div className="hidden md:flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>{formatDateDisplay(filters.startDate)} — {formatDateDisplay(filters.endDate)}</span>
                    </div>
                )}
            </div>

            <div className="p-5">
                {/* Quick Date Range Selector */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select Period</label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: "today", label: "Today" },
                            { id: "last7days", label: "Last 7 Days" },
                            { id: "thisMonth", label: "This Month" },
                            { id: "lastMonth", label: "Last Month" },
                            { id: "lastQuarter", label: "Last Quarter" },
                            { id: "thisYear", label: "This Year" }
                        ].map((range) => (
                            <button
                                key={range.id}
                                onClick={() => setQuickDateRange(range.id)}
                                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                    activeRange === range.id
                                        ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Date Pickers */}
                    <div className="space-y-1">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                aria-required="true"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                aria-required="true"
                            />
                        </div>
                    </div>

                    {/* User & Category Filters */}
                    <div className="space-y-1">
                        <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                            Sales Representative
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <select
                                id="user"
                                name="user"
                                value={filters.user}
                                onChange={handleFilterChange}
                                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">All Representatives</option>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.username}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No users available</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Product Category
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <select
                                id="category"
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">All Categories</option>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No categories available</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 flex items-center p-3 bg-red-50 rounded-md border border-red-200" role="alert">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-sm text-red-700">{error}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={handleClearFilters}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Clear Filters
                    </button>
                    <button
                        onClick={handleApplyFilters}
                        disabled={!filters.startDate || !filters.endDate || error}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            !filters.startDate || !filters.endDate || error
                                ? "bg-indigo-300 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        Generate Report
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReportFilter;