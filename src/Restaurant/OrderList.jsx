import React from "react";
import { useEffect, useState } from "react";
import { orderAPI } from "../Services/api";

function OrderList() {
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [barOrders, setBarOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch both kitchen and bar orders
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const kitchen = await orderAPI.fetchKitchenOrders();
      const bar = await orderAPI.fetchBarOrders();
      setKitchenOrders(kitchen);
      setBarOrders(bar);
      setFilteredOrders([...kitchen, ...bar]); // Show all by default
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterOrders(query, filterCategory);
  };

  // Handle category filter change
  const handleFilterChange = (e) => {
    const category = e.target.value;
    setFilterCategory(category);
    filterOrders(searchQuery, category);
  };

  // Filter orders based on search and category
  const filterOrders = (query, category) => {
    let allOrders = [...kitchenOrders, ...barOrders];

    // Filter by category
    if (category === "kitchen") {
      allOrders = kitchenOrders;
    } else if (category === "bar") {
      allOrders = barOrders;
    }

    // Search by product name or table number
    const filtered = allOrders.filter((order) => {
      const productName = order.product_name.toLowerCase();
      const tableNumber = order.sale?.table_number?.toString() || "";

      return productName.includes(query) || tableNumber.includes(query);
    });

    setFilteredOrders(filtered);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order List</h2>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product or table number"
          value={searchQuery}
          onChange={handleSearch}
          className="w-1/2 p-2 border rounded"
        />
        <select
          value={filterCategory}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="all">All Orders</option>
          <option value="kitchen">Kitchen Orders</option>
          <option value="bar">Bar Orders</option>
        </select>
      </div>

      {/* Loading and Error States */}
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Order List */}
      {!loading && !error && (
        <>
          {filteredOrders.length > 0 ? (
            <ul className="bg-white p-4 rounded shadow">
              {filteredOrders.map((order) => (
                <li key={order.id} className="border-b p-2">
                  <p>
                    <strong>Product:</strong> {order.product_name}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {order.quantity}
                  </p>
                  <p>
                    <strong>Table:</strong>{" "}
                    {order.sale?.table_number || "N/A"}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {order.routed_to === "kitchen" ? "Kitchen" : "Bar"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}
        </>
        
      )}
    </div>
  );
}

export default OrderList;


