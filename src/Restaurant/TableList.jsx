// src/components/TableManagement/TableList.jsx
import { useEffect, useState } from 'react';
import { fetchTables } from './TableAPI';

const TableList = () => {
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTables = async () => {
            try {
                const data = await fetchTables();
                setTables(data);
            } catch (error) {
                setError("Failed to fetch tables. Please try again.");
                console.error("Error fetching tables:", error);
            }
        };
        getTables();
    }, []);

    return (
        <div>
            <h2>Table List</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {tables.map(table => (
                    <li key={table.id}>Table {table.table_number} - Status: {table.status}</li>
                ))}
            </ul>
        </div>
    );
};

export default TableList;
