// src/components/TableManagement/KitchenOrders.jsx
import { useEffect, useState } from 'react';
import { fetchKitchenOrders } from './TableAPI';

const KitchenOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const data = await fetchKitchenOrders();
                setOrders(data);
            } catch (error) {
                setError("Failed to fetch kitchen orders. Please try again.");
                console.error("Error fetching kitchen orders:", error);
            }
        };
        getOrders();
    }, []);

    return (
        <div className="bg-indigo-800 text-white p-6 rounded-lg shadow-md max-w-md mx-auto w-[75%]">
            <h2 className="text-lg font-semibold mb-4">Kitchen Orders</h2>
            {error && <p style={{ }}>{error}</p>}
            <ul className="space-y-2">
                {orders.map(order => (
                    <li 
                        key={order.id} 
                        className="bg-indigo-700 p-3 rounded-md shadow-sm hover:bg-indigo-500 transition duration-300"
                    >
                        Order {order.order} - {order.quantity}x Product {order.product}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default KitchenOrders;
