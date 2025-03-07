import React, { useEffect, useState } from "react";
import { fetchKitchenOrders, fetchBarOrders } from "../Services/api";
import { handleCompleteOrder, handleCancelOrder } from "../Services/api";
import { getProducts, getCategories } from "../Services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderList() {
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [barOrders, setBarOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all"); // Filter by kitchen, bar, or all
  const [filterProductType, setFilterProductType] = useState("all"); // Filter by kitchen products, bar products, or all
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch orders, products, and categories
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch orders
      const kitchen = await fetchKitchenOrders();
      const bar = await fetchBarOrders();
      setKitchenOrders(kitchen);
      setBarOrders(bar);
      setFilteredOrders([...kitchen, ...bar]);

      // Fetch products and categories
      const productsData = await getProducts();
      const categoriesData = await getCategories();
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterOrders(query, filterCategory, filterProductType);
  };

  // Handle category filter change (kitchen, bar, or all)
  const handleFilterChange = (e) => {
    const category = e.target.value;
    setFilterCategory(category);
    filterOrders(searchQuery, category, filterProductType);
  };

  // Handle product type filter change (kitchen products, bar products, or all)
  const handleProductTypeChange = (e) => {
    const productType = e.target.value;
    setFilterProductType(productType);
    filterOrders(searchQuery, filterCategory, productType);
  };

  // Filter orders based on search, category, and product type
  const filterOrders = (query, category, productType) => {
    let allOrders = [...kitchenOrders, ...barOrders];

    // Filter by category (kitchen, bar, or all)
    if (category === "kitchen") {
      allOrders = kitchenOrders;
    } else if (category === "bar") {
      allOrders = barOrders;
    }

    // Filter by product type (kitchen products, bar products, or all)
    if (productType !== "all") {
      allOrders = allOrders.filter((order) => {
        const product = products.find((p) => p.id === order.product_id);
        return product?.category_id === productType;
      });
    }

    // Search by product name, category, or table number
    const filtered = allOrders.filter((order) => {
      const product = products.find((p) => p.id === order.product_id);
      const productName = product?.name?.toLowerCase() || "";
      const productCategory = categories.find((c) => c.id === product?.category_id)?.name || "";
      const tableNumber = order.sale?.table_number?.toString() || "";

      return (
        productName.includes(query) ||
        productCategory.includes(query) ||
        tableNumber.includes(query)
      );
    });

    setFilteredOrders(filtered);
  };

  // Handle order completion
  const completeOrder = async (id) => {
    try {
      await handleCompleteOrder(id);
      toast.success("Order marked as completed!");
      fetchData(); // Refresh data
    } catch (err) {
      toast.error("Failed to complete order.");
    }
  };

  // Handle order cancellation
  const cancelOrder = async (id) => {
    try {
      await handleCancelOrder(id);
      toast.success("Order canceled successfully!");
      fetchData(); // Refresh data
    } catch (err) {
      toast.error("Failed to cancel order.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order List</h2>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product, category, or table number"
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
        <select
          value={filterProductType}
          onChange={handleProductTypeChange}
          className="p-2 border rounded"
        >
          <option value="all">All Products</option>
          <option value="kitchen">Kitchen Products</option>
          <option value="bar">Bar Products</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && <p className="text-gray-600">Loading orders...</p>}

      {/* Order List */}
      {!loading && (
        <>
          {filteredOrders.length > 0 ? (
            <ul className="bg-white p-4 rounded shadow">
              {filteredOrders.map((order) => {
                const product = products.find((p) => p.id === order.product_id);
                const productCategory = categories.find((c) => c.id === product?.category_id)?.name || "N/A";

                return (
                  <li key={order.id} className="border-b p-4">
                    <p>
                      <strong>Product:</strong> {product?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Category:</strong> {productCategory}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {order.quantity}
                    </p>
                    <p>
                      <strong>Table:</strong> {order.sale?.table_number || "N/A"}
                    </p>
                    <p>
                      <strong>Routed To:</strong>{" "}
                      {order.routed_to === "kitchen" ? "Kitchen" : "Bar"}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-4">
                      <button
                        onClick={() => completeOrder(order.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}
        </>
      )}

      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default OrderList;