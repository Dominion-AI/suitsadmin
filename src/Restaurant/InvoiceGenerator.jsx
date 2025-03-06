import React from "react";
import { useState } from "react";
import { invoiceAPI } from "../Services/api";

function InvoiceGenerator() {
  const [tableId, setTableId] = useState("");
  const [invoice, setInvoice] = useState(null);

  const handleGenerate = async () => {
    const data = await invoiceAPI.generateInvoice(tableId);
    setInvoice(data);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Generate Invoice</h2>
      <input
        type="text"
        placeholder="Table ID"
        className="w-full p-2 border mb-4"
        onChange={(e) => setTableId(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate Invoice
      </button>

      {invoice && (
        <div className="mt-6">
          <h3 className="text-xl font-bold">Invoice Details</h3>
          <p>Invoice Number: {invoice.invoice_number}</p>
          <p>Total Amount: ${invoice.total_amount}</p>
          <a
            href={invoice.pdf_file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Download Invoice
          </a>
        </div>
      )}
    </div>
  );
}

export default InvoiceGenerator;
