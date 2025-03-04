// src/components/TableManagement/CreateReservationForm.jsx
import { useState } from 'react';
import { createReservation } from './TableAPI';

const CreateReservationForm = ({ onReservationCreated }) => {
    const [customerName, setCustomerName] = useState('');
    const [tableId, setTableId] = useState('');
    const [reservationTime, setReservationTime] = useState('');
    const [error, setError] = useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const reservationData = { table: Number(tableId), customer_name: customerName, reservation_time: reservationTime };

        try {
            await createReservation(reservationData);
            onReservationCreated();
        } catch (error) {
            setError("Failed to create reservation. Please try again.");
            console.error("Error creating reservation:", error);
        }
    };
    
    return (
        <form 
            onSubmit={handleSubmit} 
            className="bg-indigo-500 text-white p-6 rounded-lg shadow-md max-w-md mx-auto w-[75%]"
        >
            <h2 className="text-lg font-semibold mb-4">Create Reservation</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <label className="block mb-2">Customer Name:</label>
            <input 
                type="text" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                required 
                className="w-full p-2 mb-4 text-black bg-slate-100 border-indigo-900 border-2 rounded-md"
            />
    
            <label className="block mb-2">Table ID:</label>
            <input 
                type="number" 
                value={tableId} 
                onChange={(e) => setTableId(e.target.value)} 
                required 
                className="w-full p-2 mb-4 text-black rounded-md bg-slate-100 border-indigo-900 border-2"
            />
    
            <label className="block mb-2">Reservation Time:</label>
            <input 
                type="datetime-local" 
                value={reservationTime} 
                onChange={(e) => setReservationTime(e.target.value)} 
                required 
                className="w-full p-2 mb-4 text-black rounded-md bg-slate-100 border-indigo-900 border-2"
            />
    
            <button 
                type="submit" 
                className="w-full bg-indigo-700 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md transition duration-300"
            >
                Create
            </button>
        </form>
    );
};

export default CreateReservationForm;
