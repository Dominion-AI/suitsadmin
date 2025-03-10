import React from 'react';
import PropTypes from 'prop-types';

function LogDetailsModal({ log, onClose }) {
    if (!log) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{log.event_type}</h2>
                    <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded mb-4">
                    <p className="mb-2"><strong>Timestamp:</strong> {new Date(log.created_at).toLocaleString()}</p>
                    <p className="mb-4"><strong>Message:</strong> {log.decrypted_message}</p>
                    
                    {log.user_id && (
                        <p className="mb-2"><strong>User ID:</strong> {log.user_id}</p>
                    )}
                    
                    {log.ip_address && (
                        <p className="mb-2"><strong>IP Address:</strong> {log.ip_address}</p>
                    )}
                </div>
                
                <div className="flex justify-end">
                    <button 
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

LogDetailsModal.propTypes = {
    log: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        event_type: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        decrypted_message: PropTypes.string.isRequired,
        user_id: PropTypes.string,
        ip_address: PropTypes.string
    }),
    onClose: PropTypes.func.isRequired
};

export default LogDetailsModal;