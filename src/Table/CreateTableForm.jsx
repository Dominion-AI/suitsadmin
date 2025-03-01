// src/components/TableManagement/CreateTableForm.jsx
import { useState } from 'react';
import { createTable } from './TableAPI';

const CreateTableForm = ({ token, onTableCreated }) => {
    const [tableNumber, setTableNumber] = useState('');
    const [capacity, setCapacity] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const tableData = { table_number: Number(tableNumber), capacity: Number(capacity), status: 'free' };
        await createTable(token, tableData);
        onTableCreated();
    };
    
    return (
        <form 
            onSubmit={handleSubmit} 
            className="bg-indigo-800 text-white p-6 rounded-lg shadow-md max-w-md mx-auto"
        >
            <h2 className="text-lg font-semibold mb-4">Create Table</h2>
            
            <label className="block mb-2">Table Number:</label>
            <input 
                type="number" 
                value={tableNumber} 
                onChange={(e) => setTableNumber(e.target.value)} 
                required 
                className="w-full p-2 mb-4 text-black rounded-md"
            />
    
            <label className="block mb-2">Capacity:</label>
            <input 
                type="number" 
                value={capacity} 
                onChange={(e) => setCapacity(e.target.value)} 
                required 
                className="w-full p-2 mb-4 text-black rounded-md"
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