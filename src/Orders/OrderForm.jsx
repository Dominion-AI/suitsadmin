import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createOrder, getProducts } from '../Services/api';

const OrderForm = ({ onOrderCreated }) => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { product: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      alert('Please enter a customer name');
      return;
    }
    
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }
    
    if (items.some(item => !item.product)) {
      alert('Please select a product for all items');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const newOrder = await createOrder({ 
        customer_name: customerName, 
        items 
      });
      onOrderCreated(newOrder);
      setCustomerName('');
      setItems([]);
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-500 text-white p-4">
        <h2 className="text-xl font-bold">Create New Order</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5">
        <div className="mb-5">
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            id="customerName"
            type="text"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border border-gray-300 rounded-md w-full p-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
            required
          />
        </div>

        <div className="mb-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Order Items</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 transition-colors flex items-center"
            >
              <span className="mr-1">+</span> Add Item
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-3 text-gray-500">Loading products...</div>
          ) : error ? (
            <div className="text-center py-3 text-red-500">{error}</div>
          ) : (
            <div>
              {items.length === 0 ? (
                <div className="text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-md">
                  No items added. Click "Add Item" to start building your order.
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex-grow">
                        <select
                          value={item.product}
                          onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                          className="border border-gray-300 rounded-md w-full p-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
                          required
                        >
                          <option value="">Select a product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - ${product.price}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="border border-gray-300 rounded-md w-full p-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <button
            type="submit"
            disabled={isSubmitting || isLoading || items.length === 0}
            className={`w-full py-2 px-4 rounded-md font-medium text-white 
              ${isSubmitting || isLoading || items.length === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-500 hover:bg-indigo-600 transition-colors'}`}
          >
            {isSubmitting ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

OrderForm.propTypes = {
  onOrderCreated: PropTypes.func.isRequired
};

export default OrderForm;