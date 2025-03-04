import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getOrders } from "../Services/api";
import OrderForm from "./OrderForm";
import OrderDetails from "./OrderDetails";

// Order shape PropType definition
const OrderShape = {
  id: PropTypes.string.isRequired,
  customer_name: PropTypes.string.isRequired,
  total_amount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      product_name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price_at_purchase: PropTypes.number.isRequired,
    })
  ).isRequired,
};

// Define PropTypes for child components
OrderForm.propTypes = {
  onOrderCreated: PropTypes.func.isRequired
};

OrderDetails.propTypes = {
  order: PropTypes.shape(OrderShape).isRequired
};

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderCreated = (newOrder) => {
    // Refresh order list to ensure all data is up to date
    fetchOrders();
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleGenerateInvoice = (e, orderId) => {
    e.stopPropagation(); // Prevent order selection
    alert(`Invoice generation for Order #${orderId} will be implemented later.`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Sales Processing</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Create Order</h3>
          <OrderForm onOrderCreated={handleOrderCreated} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Orders</h3>
          {isLoading ? (
            <p className="text-center py-4">Loading orders...</p>
          ) : error ? (
            <div className="text-red-500 p-4">
              <p>{error}</p>
              <button 
                onClick={fetchOrders}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Retry
              </button>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No orders found</p>
          ) : (
            <ul className="divide-y divide-gray-300">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="py-2 cursor-pointer hover:bg-gray-200 p-2 rounded-lg"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="flex justify-between items-center">
                    <span>{order.customer_name} - ${order.total_amount}</span>
                    <button
                      onClick={(e) => handleGenerateInvoice(e, order.id)}
                      className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Generate Invoice
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Order Details</h3>
            <button 
              onClick={() => setSelectedOrder(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <OrderDetails order={selectedOrder} />
        </div>
      )}
    </div>
  );
};

export default OrderManager;