<<<<<<< HEAD
=======
import React from "react";
>>>>>>> 5df3d5c (Trying method)
import { useState } from "react";
import PropTypes from 'prop-types';
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Printer 
} from "lucide-react";
import { updateSaleStatus, generateInvoice } from "../Services/api";

const STATUS_COLORS = {
  pending: "text-yellow-600 bg-yellow-50",
  completed: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50"
};

const SaleDetails = ({ 
  sale, 
  onBack, 
  onSaleUpdated = () => {} 
}) => {
  const [status, setStatus] = useState(sale?.status || 'pending');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Convert total amount to fixed 2 decimal places safely
  const formatAmount = (amount) => {
    // Check if amount is a number
    const numAmount = Number(amount);
    return isNaN(numAmount) ? '0.00' : numAmount.toFixed(2);
  };

  const handleStatusChange = async (newStatus) => {
    setError(null);
    setIsLoading(true);
    try {
      const updatedSale = await updateSaleStatus(sale.id, newStatus);
      setStatus(updatedSale.status);
      onSaleUpdated(updatedSale);
    } catch (error) {
      setError("Failed to update sale status. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const invoice = await generateInvoice(sale.id);
      window.open(invoice.invoice_url, "_blank");
    } catch (error) {
      setError("Failed to generate invoice. Ensure the sale is completed.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (currentStatus) => {
    const statusIcons = {
      pending: <Clock className="mr-2" />,
      completed: <CheckCircle className="mr-2" />,
      cancelled: <XCircle className="mr-2" />
    };
    return statusIcons[currentStatus] || <Clock className="mr-2" />;
  };

  // Safely render items
  const renderItems = () => {
    if (!sale?.items || sale.items.length === 0) {
      return (
        <div className="text-gray-500 text-center py-4">
          No items in this sale
        </div>
      );
    }

    return sale.items.map((item) => {
      // Safely calculate item total
      const itemQuantity = Number(item.quantity) || 0;
      const itemPrice = Number(item.price_at_sale) || 0;
      const itemTotal = (itemQuantity * itemPrice).toFixed(2);

      return (
        <div 
          key={item.id || Math.random()} 
          className="flex justify-between items-center border-b last:border-b-0 py-3"
        >
          <div>
            <p className="font-medium">{item.product_name || 'Unnamed Product'}</p>
            <p className="text-gray-600 text-sm">
              {itemQuantity} × ${itemPrice.toFixed(2)}
            </p>
          </div>
          <p className="font-semibold text-indigo-600">
            ${itemTotal}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-800 flex items-center">
          <FileText className="mr-3 text-indigo-600" size={32} />
          Sale #{sale?.id || 'N/A'} Details
        </h2>
        <button 
          onClick={onBack}
          className="text-gray-600 hover:text-indigo-600 flex items-center"
        >
          <ArrowLeft className="mr-2" size={20} /> Back
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
          <AlertTriangle className="mr-3 text-red-500" size={24} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600 mb-2">
            <strong className="text-gray-800">Customer:</strong> {sale?.customer_name || 'Unknown'}
          </p>
          <p className="text-gray-600 mb-2">
            <strong className="text-gray-800">Total Amount:</strong> 
            <span className="text-green-600 font-semibold ml-2">
              ${formatAmount(sale?.total_amount)}
            </span>
          </p>
        </div>
        <div>
          <div className="flex items-center">
            <strong className="text-gray-800 mr-2">Status:</strong>
            <div className={`flex items-center px-3 py-1 rounded-full ${STATUS_COLORS[status] || STATUS_COLORS.pending}`}>
              {getStatusIcon(status)}
              {(status?.charAt(0).toUpperCase() || '') + (status?.slice(1) || '')}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Sale Items</h3>
        {renderItems()}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Sale Status
          </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-end space-x-4">
          <button
            onClick={handleGenerateInvoice}
            disabled={status !== "completed" || isLoading}
            className="flex-grow flex items-center justify-center bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-300"
          >
            {isLoading ? (
              <>Generating...</>
            ) : (
              <>
                <Printer className="mr-2" size={20} />
                Generate Invoice
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

SaleDetails.propTypes = {
  sale: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    customer_name: PropTypes.string,
    total_amount: PropTypes.oneOfType([
      PropTypes.number, 
      PropTypes.string
    ]),
    status: PropTypes.oneOf(['pending', 'completed', 'cancelled']),
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      product_name: PropTypes.string,
      quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      price_at_sale: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }))
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onSaleUpdated: PropTypes.func
};

export default SaleDetails;