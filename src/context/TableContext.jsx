import { createContext, useState, useEffect } from "react";
import { fetchTables } from "../Table/TableAPI";  // Ensure correct path!

export const TableContext = createContext();

export const TableProvider = ({ children }) => {  // Use named export
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem("authToken"); // Ensure correct key
        if (!token) {
            console.warn("No authentication token found.");
            setLoading(false);
            return;
        }

        const getTables = async () => {
            try {
                const data = await fetchTables(token);

                if (data?.detail === "Authentication credentials were not provided.") {
                    console.warn("Unauthorized: Clearing token and redirecting to login.");
                    localStorage.removeItem("authToken");
                    setError("Session expired. Please log in again.");
                    return;
                }

                setTables(data);
            } catch (err) {
                console.error("Error fetching tables:", err);
                setError("Failed to load tables.");
            } finally {
                setLoading(false);
            }
        };

        getTables();
    }, []);

    return (
        <TableContext.Provider value={{ tables, setTables, loading, error }}>
            {children}
        </TableContext.Provider>
    );
};
