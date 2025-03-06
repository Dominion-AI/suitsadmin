import PropTypes from 'prop-types';
import React from "react";
import { 
  Eye, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ShoppingCart 
} from 'lucide-react';

const STATUS_ICONS = {
  pending: <Clock className="text-yellow-500" size={20} />,
  completed: <CheckCircle className="text-green-500" size={20} />,
  cancelled: <XCircle className="text-red-500" size={20} />
};

const STATUS_COLORS = {
  pending: "text-yellow-600 bg-yellow-50",
  completed: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50"
};

const SaleList = ({ sales, onViewDetails, onGenerateInvoice }) => {
  // Safely format amount
  const formatAmount = (amount) => {
    const numAmount = Number(amount);
    return isNaN(numAmount) ? '0.00' : numAmount.toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-indigo-800 flex items-center">
          <ShoppingCart className="mr-3 text-indigo-600" size={32} />
          Sales List
        </h2>
        <div className="text-gray-600">
          Total Sales: {sales.length}
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ShoppingCart className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500 text-xl">No sales found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => (
            <div 
              key={sale.id} 
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <div className="flex-grow">
                  <div className="flex items-center space-x-3">
                    <p className="font-bold text-lg text-gray-800">
                      {sale.customer_name}
                    </p>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs ${STATUS_COLORS[sale.status] || 'bg-gray-100'}`}>
                      {STATUS_ICONS[sale.status] || STATUS_ICONS.pending}
                      <span className="ml-1">{sale.status}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-gray-600">
                    <p>
                      <strong>Total:</strong> 
                      <span className="ml-2 text-green-600 font-semibold">
                        ${formatAmount(sale.total_amount)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => onViewDetails(sale)}
                    className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300"
                  >
                    <Eye className="mr-2" size={20} />
                    View Details
                  </button>
                  <button
                    onClick={() => onGenerateInvoice(sale.id)}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    <FileText className="mr-2" size={20} />
                    Generate Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

SaleList.propTypes = {
  sales: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    customer_name: PropTypes.string.isRequired,
    total_amount: PropTypes.oneOfType([
      PropTypes.number, 
      PropTypes.string
    ]).isRequired,
    status: PropTypes.oneOf(['pending', 'completed', 'cancelled']).isRequired
  })).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onGenerateInvoice: PropTypes.func.isRequired,
};

export default SaleList;