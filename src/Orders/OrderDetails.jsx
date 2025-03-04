import React from 'react';
import { generateInvoice } from '../Services/api';
import { saveAs } from 'file-saver';

const OrderDetails = ({ order }) => {
  const handleGenerateInvoice = async () => {
    try {
      const invoiceBlob = await generateInvoice(order.id);
      const invoiceFileName = `invoice_${order.id}.pdf`;
      saveAs(invoiceBlob, invoiceFileName);
      alert('Invoice generated successfully!');
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">Order #{order.id} Details</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        <p className="text-gray-700">Name: <span className="font-medium">{order.customer_name}</span></p>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Order Items</h3>
        <ul className="list-disc list-inside">
          {order.items.map((item) => (
            <li key={item.id} className="text-gray-700">
              <span className="font-medium">{item.product_name}</span> — {item.quantity} x ${item.price_at_purchase}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t pt-4">
        <h3 className="text-xl font-bold">Total Amount: ${order.total_amount}</h3>
      </div>
      <button
        className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleGenerateInvoice}
      >
        Generate Invoice
      </button>
    </div>
  );
};

export default OrderDetails;
