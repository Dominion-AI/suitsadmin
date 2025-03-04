import React, { createContext, useState, useEffect } from "react";
import { fetchReservations } from "../Table/TableAPI";

export const ReservationContext = createContext();

const ReservationProvider = ({ children }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");  // Ensure key is correct
        if (!token) {
            console.warn("No authentication token found.");
            setLoading(false);
            return;
        }

        const getReservations = async () => {
            try {
                const data = await fetchReservations(token);

                if (data?.detail === "Authentication credentials were not provided.") {
                    console.warn("Unauthorized: Clearing token and redirecting to login.");
                    localStorage.removeItem("authToken");
                    setError("Session expired. Please log in again.");
                    return;
                }

                setReservations(data);
            } catch (err) {
                console.error("Error fetching reservations:", err);
                setError("Failed to load reservations.");
            } finally {
                setLoading(false);
            }
        };

        getReservations();
    }, []);

    return (
        <ReservationContext.Provider value={{ reservations, setReservations, loading, error }}>
            {children}
        </ReservationContext.Provider>
    );
};

export default ReservationProvider;

