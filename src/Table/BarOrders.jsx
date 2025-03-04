// src/components/TableManagement/BarOrders.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import { fetchBarOrders } from './TableAPI';

const BarOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const data = await fetchBarOrders();
                setOrders(data);
            } catch (error) {
                setError("Failed to fetch bar orders. Please try again.");
                console.error("Error fetching bar orders:", error);
            }
        };
        getOrders();
    }, []);

    return (
        <div className="bg-indigo-500 text-white p-4 rounded-lg w-[80%] mx-auto">
            <h2 className="text-lg font-semibold mb-2">Bar Orders</h2>
            {error && <p style={{  }}>{error}</p>}
            <ul>
                {orders.map(order => (
                    <li 
                        key={order.id} 
                        className="p-2 mb-2 bg-indigo-400 rounded-md hover:bg-indigo-500">
                        Order {order.order} - {order.quantity}x Product {order.product}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BarOrders;
