import React, { useState, useEffect } from 'react';
import { fetchLogs } from '../Services/api';
import LogTable from './LogTable';
import LogFilter from './LogFilter';
import LogDetailsModal from './LogDetailsModal';

function SecurityLogViewer() {
    const [logs, setLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadLogs = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchLogs(filters.eventType, filters.date);
            setLogs(data);
        } catch (error) {
            console.error('Failed to load logs:', error);
            setError('Failed to load logs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Security Logs</h1>
            <LogFilter onFilterChange={loadLogs} />
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <p>{error}</p>
                </div>
            )}
            
            {loading ? (
                <div className="flex justify-center my-8">
                    <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
            ) : (
                <LogTable logs={logs} onViewDetails={(log) => setSelectedLog(log)} />
            )}
            
            <LogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
        </div>
    );
}

export default SecurityLogViewer;