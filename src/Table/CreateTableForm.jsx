// src/components/TableManagement/CreateTableForm.jsx
import React, { useState } from 'react';
import { createTable } from './TableAPI';

const CreateTableForm = ({ onTableCreated }) => {
    const [tableNumber, setTableNumber] = useState('');
    const [capacity, setCapacity] = useState('');
    const [error, setError] = useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const tableData = { table_number: Number(tableNumber), capacity: Number(capacity), status: 'free' };

        try {
            await createTable(tableData);
            onTableCreated();
        } catch (error) {
            setError("Failed to create table. Please try again.");
            console.error("Error creating table:", error);
        }
    };
    
    return (
        <form 
            onSubmit={handleSubmit} 
            className="bg-indigo-800 text-white p-6 rounded-lg shadow-md max-w-md mx-auto w-[75%]"
        >
            <h2 className="text-lg font-semibold mb-4">Create Table</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <label className="block mb-2">Table Number:</label>
            <input 
                type="number" 
                value={tableNumber} 
                onChange={(e) => setTableNumber(e.target.value)} 
                required 
                className="w-full p-2 mb-4 text-black rounded-md bg-slate-100 border-indigo-900 border-2"
            />
    
            <label className="block mb-2">Capacity:</label>
            <input 
                type="number" 
                value={capacity} 
                onChange={(e) => setCapacity(e.target.value)} 
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

export default CreateTableForm;
