import React, { useEffect, useState } from "react";
import { getCategories, getProducts, createSale } from "../Services/api";
import { tableAPI } from "../Services/api";
import { fetchKitchenOrders, fetchBarOrders } from "../Services/api";
import { handleCompleteOrder, handleCancelOrder } from "../Services/api";
import { ShoppingCart, Plus, Minus, X, Check, AlertCircle, Coffee, Utensils } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderList() {
  // States for new order creation
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState({ kitchen: null, bar: null });
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ product: "", quantity: 1, tableNumber: "", customerName: "" });
  
  // States for order listing
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [barOrders, setBarOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterProductType, setFilterProductType] = useState("all");
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch all necessary data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch categories and products
      await fetchProducts();
      
      // Fetch tables
      await fetchTables();
      
      // Fetch existing orders
      const kitchen = await fetchKitchenOrders();
      const bar = await fetchBarOrders();
      setKitchenOrders(kitchen);
      setBarOrders(bar);
      setFilteredOrders([...kitchen, ...bar]);
    } catch (err) {
      setError(err.message || "Failed to fetch data.");
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      // Fetch categories and find Food (Kitchen) and Bar
      const categoryData = await getCategories();
      const kitchenCategory = categoryData.find((cat) => cat.name.toLowerCase() === "food");
      const barCategory = categoryData.find((cat) => cat.name.toLowerCase() === "bar");

      if (!kitchenCategory || !barCategory) {
        throw new Error("Kitchen (Food) or Bar category not found.");
      }

      setCategories({ kitchen: kitchenCategory.id, bar: barCategory.id });
      
      // Store full categories data for filtering
      setCategories(prevState => ({
        ...prevState,
        allCategories: categoryData
      }));

      // Fetch products and filter by category
      const productData = await getProducts();
      const filteredProducts = productData.filter(
        (prod) => prod.category === kitchenCategory.id || prod.category === barCategory.id
      );

      setProducts(filteredProducts);
    } catch (err) {
      throw new Error(err.message || "Failed to fetch products.");
    }
  };

  const fetchTables = async () => {
    try {
      const tableData = await tableAPI.fetchTables();
      setTables(tableData);
    } catch (err) {
      throw new Error("Failed to fetch tables.");
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  // Add item to the order list
  const addOrder = () => {
    const product = products.find((p) => p.id === parseInt(newOrder.product));

    if (!product || !newOrder.tableNumber || !newOrder.customerName || newOrder.quantity <= 0) {
      setError("Please fill out all fields correctly.");
      return;
    }

    const newItem = {
      id: product.id,
      name: product.name,
      quantity: newOrder.quantity,
      price: product.price,
      subtotal: product.price * newOrder.quantity,
      tableNumber: newOrder.tableNumber,
      category: product.category,
    };

    setOrders([...orders, newItem]);
    setNewOrder({ product: "", quantity: 1, tableNumber: newOrder.tableNumber, customerName: newOrder.customerName }); // Reset product, keep table & customer name
    setError("");
    setSuccess("Item added to order");
    setTimeout(() => setSuccess(""), 2000);
  };

  // Remove item from the order
  const removeOrderItem = (index) => {
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);
  };

  // Update quantity
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedOrders = [...orders];
    updatedOrders[index].quantity = newQuantity;
    updatedOrders[index].subtotal = updatedOrders[index].price * newQuantity;
    setOrders(updatedOrders);
  };

  // Calculate total price
  const totalPrice = orders.reduce((total, item) => total + item.subtotal, 0);

  // Filter products by category tab
  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter(product => 
        activeTab === "kitchen" 
          ? product.category === categories.kitchen 
          : product.category === categories.bar
      );

  // Complete the new order
  const completeOrder = async () => {
    if (orders.length === 0) {
      setError("No items in the order.");
      return;
    }

    try {
      const saleData = {
        table_number: Number(newOrder.tableNumber),
        customer_name: newOrder.customerName,
        items: orders.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          price_at_sale: Number(item.price),
        })),
      };

      await createSale(saleData);
      setSuccess("Order completed successfully!");
      setOrders([]);
      setNewOrder({ product: "", quantity: 1, tableNumber: "", customerName: "" });
      setTimeout(() => setSuccess(""), 3000);
      
      // Refresh the order list
      fetchData();
    } catch (err) {
      console.error("Failed to complete order:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to complete order.");
    }
  };

  // Handle existing order completion
  const markOrderComplete = async (id) => {
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

  // Handle product type filter change
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
      const productCategory = categories.allCategories?.find((c) => c.id === product?.category_id)?.name?.toLowerCase() || "";
      const tableNumber = order.sale?.table_number?.toString() || "";

      return (
        productName.includes(query) ||
        productCategory.includes(query) ||
        tableNumber.includes(query)
      );
    });

    setFilteredOrders(filtered);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <ShoppingCart className="mr-2" /> Restaurant Orders
        </h2>
        {orders.length > 0 && (
          <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {orders.length} {orders.length === 1 ? 'item' : 'items'} in cart
          </div>
        )}
      </div>

      {/* Notification Messages */}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 flex items-center">
          <Check className="mr-2" />
          <span>{success}</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center">
          <AlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* NEW ORDER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Customer & Table</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={newOrder.customerName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                <select
                  id="tableNumber"
                  name="tableNumber"
                  value={newOrder.tableNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Table</option>
                  {tables.map((table) => (
                    <option key={table.id} value={table.table_number}>
                      Table {table.table_number} (Seats {table.capacity})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Add Items to Order</h3>
            
            {/* Category Tabs */}
            <div className="flex mb-4 border-b">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 font-medium text-sm mr-2 ${
                  activeTab === "all"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setActiveTab("kitchen")}
                className={`px-4 py-2 font-medium text-sm mr-2 flex items-center ${
                  activeTab === "kitchen"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Utensils className="w-4 h-4 mr-1" /> Kitchen
              </button>
              <button
                onClick={() => setActiveTab("bar")}
                className={`px-4 py-2 font-medium text-sm flex items-center ${
                  activeTab === "bar"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Coffee className="w-4 h-4 mr-1" /> Bar
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                <select
                  id="product"
                  name="product"
                  value={newOrder.product}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Choose an item</option>
                  {filteredProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price} ({product.category === categories.kitchen ? "Kitchen" : "Bar"})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <div className="flex items-center">
                  <button 
                    className="bg-gray-200 px-3 py-2 rounded-l-md hover:bg-gray-300"
                    onClick={() => setNewOrder({...newOrder, quantity: Math.max(1, newOrder.quantity - 1)})}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={newOrder.quantity}
                    onChange={handleInputChange}
                    className="p-2 border-t border-b border-gray-300 text-center w-16"
                  />
                  <button 
                    className="bg-gray-200 px-3 py-2 rounded-r-md hover:bg-gray-300"
                    onClick={() => setNewOrder({...newOrder, quantity: newOrder.quantity + 1})}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={addOrder}
              disabled={!newOrder.product || !newOrder.tableNumber || !newOrder.customerName}
              className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${(!newOrder.product || !newOrder.tableNumber || !newOrder.customerName) 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
            >
              <Plus className="mr-2" /> Add to Order
            </button>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center justify-between">
              <span>Order Summary</span>
              {newOrder.customerName && <span className="text-sm font-normal text-gray-500">for {newOrder.customerName}</span>}
            </h3>
            
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Your order is empty</p>
                <p className="text-sm mt-2">Add items from the menu to get started</p>
              </div>
            ) : (
              <>
                <div className="mb-4 max-h-64 overflow-y-auto">
                  {orders.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 py-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">${Number(item.price).toFixed(2)} each</div>
                        </div>
                        <button
                          onClick={() => removeOrderItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center mt-2">
                        <button 
                          className="bg-gray-200 px-2 py-1 rounded-l text-xs"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 border-t border-b border-gray-200 text-center text-sm min-w-8">
                          {item.quantity}
                        </span>
                        <button 
                          className="bg-gray-200 px-2 py-1 rounded-r text-xs"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="ml-auto font-medium">${Number(item.subtotal).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center font-medium text-lg mb-6">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <button
                    onClick={completeOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center"
                  >
                    <Check className="mr-2" /> Complete Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* EXISTING ORDERS SECTION */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Existing Orders</h3>
        
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by product, category, or table number"
            value={searchQuery}
            onChange={handleSearch}
            className="flex-grow p-2 border rounded"
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
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => {
                  const product = products.find((p) => p.id === order.product_id);
                  const productCategory = categories.allCategories?.find((c) => c.id === product?.category_id)?.name || "N/A";

                  return (
                    <li key={order.id} className="border rounded p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{product?.name || "N/A"}</h4>
                          <span className={`inline-block px-2 py-1 text-xs rounded ${order.routed_to === "kitchen" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"} mt-1`}>
                            {order.routed_to === "kitchen" ? "Kitchen" : "Bar"}
                          </span>
                        </div>
                        <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                          Qty: {order.quantity}
                        </span>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Category: {productCategory}</p>
                        <p>Table: {order.sale?.table_number || "N/A"}</p>
                        <p>Customer: {order.sale?.customer_name || "N/A"}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => markOrderComplete(order.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 mr-1" /> Complete
                        </button>
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center"
                        >
                          <X className="w-4 h-4 mr-1" /> Cancel
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No orders found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default OrderList;