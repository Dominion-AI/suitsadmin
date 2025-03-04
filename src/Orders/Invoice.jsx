import React, { useState } from "react";
import { generateInvoice } from "../Services/api";

const Invoice = ({ order, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateInvoice = async () => {
    setLoading(true);
    setError("");

    try {
      const invoice = await generateInvoice(order.id);
      if (invoice && invoice.invoice_url) {
        window.open(invoice.invoice_url, "_blank");
      } else {
        setError("Failed to generate invoice. Please try again.");
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
      setError("An error occurred while generating the invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Invoice</h3>
      <p>Customer: {order.customer_name}</p>
      <p>Total Amount: ${order.total_amount}</p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleGenerateInvoice}
        disabled={loading}
        className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {loading ? "Generating Invoice..." : "Generate Invoice"}
      </button>

      <button
        onClick={onBack}
        className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
      >
        Back
      </button>
    </div>
  );
};

export default Invoice;
