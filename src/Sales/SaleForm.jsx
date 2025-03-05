import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Plus, 
  Trash2, 
  ShoppingCart, 
  AlertTriangle, 
  Loader2 
} from 'lucide-react';
import { createSale, getProducts } from '../Services/api';

const SaleForm = ({ onSaleCreated }) => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    customerName: '',
    items: '',
    general: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setErrors(prev => ({
          ...prev, 
          general: 'Failed to load products. Please check your connection.'
        }));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddItem = () => {
    const newItems = [...items, { product: '', quantity: 1 }];
    setItems(newItems);
    
    // Clear any previous items-related error
    setErrors(prev => ({ ...prev, items: '' }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);

    // Clear items error if the last item is removed
    if (updatedItems.length === 0) {
      setErrors(prev => ({ ...prev, items: '' }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);

    // Clear validation errors for this change
    setErrors(prev => ({ 
      ...prev, 
      items: '',
      general: ''
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { customerName: '', items: '', general: '' };

    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
      valid = false;
    }

    if (items.length === 0) {
      newErrors.items = 'At least one item is required';
      valid = false;
    }

    const incompleteItems = items.some(item => !item.product);
    if (incompleteItems) {
      newErrors.items = 'Please select a product for all items';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({ customerName: '', items: '', general: '' });

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const newSale = await createSale({ 
        customer_name: customerName, 
        items 
      });
      onSaleCreated(newSale);
      setCustomerName('');
      setItems([]);
    } catch (error) {
      setErrors(prev => ({
        ...prev, 
        general: 'Failed to create sale. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-6 text-teal-800 flex items-center">
        <ShoppingCart className="mr-3 text-teal-600" size={32} />
        Create New Sale
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-2 font-semibold">
            Customer Name
          </label>
          <input
            type="text"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              setErrors(prev => ({ ...prev, customerName: '' }));
            }}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition duration-300 ${
              errors.customerName 
                ? 'border-red-500 bg-red-50 focus:ring-red-300' 
                : 'border-gray-300 focus:ring-teal-500'
            }`}
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Sale Items</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 transition duration-300"
            >
              <Plus size={20} className="mr-1" /> Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-2 mb-3 p-3 bg-gray-50 rounded-lg"
            >
              <select
                value={item.product}
                onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                className={`flex-grow p-2 border rounded-lg focus:ring-2 focus:outline-none transition duration-300 ${
                  errors.items && !item.product 
                    ? 'border-red-500 bg-red-50 focus:ring-red-300' 
                    : 'border-gray-300 focus:ring-teal-500'
                }`}
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price.toFixed(2)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition duration-300"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {errors.items && (
            <p className="text-red-500 text-sm mt-1">{errors.items}</p>
          )}
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertTriangle className="mr-3 text-red-500" size={24} />
            <span>{errors.general}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="w-full flex items-center justify-center bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 transition duration-300"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={20} /> 
              Creating Sale...
            </>
          ) : (
            'Create Sale'
          )}
        </button>
      </form>
    </div>
  );
};

SaleForm.propTypes = {
  onSaleCreated: PropTypes.func.isRequired,
};

export default SaleForm;