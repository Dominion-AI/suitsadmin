import React, { useEffect, useState } from "react";
import { getSaleById, generateInvoice } from "../Services/api";
import { ArrowLeft, FileText, Download, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function InvoiceGenerator() {
  const { saleId } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch sale and invoice data
  useEffect(() => {
    fetchInvoice();
  }, [saleId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch sale details
      const saleData = await getSaleById(saleId);
      setSale(saleData);

      // Generate invoice
      const invoiceData = await generateInvoice(saleId);
      setInvoice(invoiceData);
    } catch (err) {
      console.error("Failed to fetch invoice:", err.response?.data || err.message);
      setError("Failed to load invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF download
  const handleDownload = () => {
    if (invoice?.pdf_file) {
      window.open(invoice.pdf_file, "_blank");
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="mb-6">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </button>
      </div>

      {loading ? (
        <div className="p-4 bg-gray-100 rounded">
          <FileText className="w-6 h-6 animate-bounce inline-block mr-2" />
          Generating Invoice...
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <AlertCircle className="w-5 h-5 inline-block mr-2" />
          {error}
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Invoice for Sale #{saleId}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-medium">Table Number:</p>
                <p className="text-gray-700">{sale?.table_number || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Customer Name:</p>
                <p className="text-gray-700">{sale?.customer_name || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Total Amount:</p>
                <p className="text-gray-700">
                  ${sale?.total_amount ? sale.total_amount.toFixed(2) : "0.00"}
                </p>
              </div>
              <div>
                <p className="font-medium">Status:</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    sale?.status === "settled" ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {sale?.status || "Pending"}
                </span>
              </div>
            </div>

            {/* Invoice Items */}
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Order Items</h3>
            <div className="max-h-64 overflow-y-auto mb-6">
              {sale?.items?.length > 0 ? (
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Product</th>
                      <th className="p-2 border">Quantity</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.items.map((item, index) => (
                      <tr key={index}>
                        <td className="p-2 border">{item.product_name}</td>
                        <td className="p-2 border">{item.quantity}</td>
                        <td className="p-2 border">${item.price_at_sale.toFixed(2)}</td>
                        <td className="p-2 border">
                          ${(item.quantity * item.price_at_sale).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items found for this sale.</p>
              )}
            </div>

            {/* Tax and Total */}
            {invoice?.tax_details && Object.keys(invoice.tax_details).length > 0 && (
              <>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Taxes</h3>
                <ul className="mb-6">
                  {Object.entries(invoice.tax_details).map(([tax, amount], index) => (
                    <li key={index} className="flex justify-between py-2">
                      <span>{tax}</span>
                      <span>${Number(amount).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Control Code */}
            {invoice?.control_code && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-lg font-bold mb-2">SENIAT Control Code</h3>
                <p className="text-gray-700">{invoice.control_code}</p>
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Invoice (PDF)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default InvoiceGenerator;
