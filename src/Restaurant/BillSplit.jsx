// BillSplitComponent.js - Split Bill & Invoice Management
import React, { useEffect, useState } from "react";
import { getSaleById, splitBill, getBillSplits } from "../Services/api";
import { invoiceAPI } from "../Services/api";
import { FileText, Download, AlertCircle } from "lucide-react";

function BillSplit({ saleId, tableId }) {
  const [sale, setSale] = useState(null);
  const [billSplits, setBillSplits] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: "",
    amount_paid: "",
    payment_method: "cash",
    exchange_rate: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  // Fetch sale and existing bill splits
  useEffect(() => {
    if (saleId) {
      fetchSaleDetails();
      fetchBillSplits();
    } else {
      setError("No sale ID provided. Please complete an order first.");
      setLoading(false);
    }
  }, [saleId]);

  const fetchSaleDetails = async () => {
    try {
      setLoading(true);
      const saleData = await getSaleById(saleId);
      setSale(saleData);

      // If sale is already settled, try fetching the invoice
      if (saleData.status === "settled") {
        fetchInvoice();
      }
    } catch (err) {
      setError("Failed to fetch sale details.");
      console.error("Fetch Sale Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBillSplits = async () => {
    if (!saleId) return;
    
    try {
      const splits = await getBillSplits(saleId);
      setBillSplits(splits);
    } catch (err) {
      setError("Failed to fetch bill splits.");
      console.error("Fetch Bill Splits Error:", err.response?.data || err.message);
    }
  };

  const fetchInvoice = async () => {
    try {
      setIsGeneratingInvoice(true);
      const invoiceData = await invoiceAPI.generateInvoice(tableId);
      setInvoice(invoiceData);
      setSuccess("Invoice generated successfully!");
    } catch (err) {
      console.error("Failed to generate invoice:", err.response?.data || err.message);
      setError("Failed to generate invoice. Please try again.");
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const fetchInvoiceById = async (invoiceId) => {
    try {
      const invoiceData = await invoiceAPI.fetchInvoiceById(invoiceId);
      setInvoice(invoiceData);
    } catch (err) {
      console.error("Failed to fetch invoice:", err.response?.data || err.message);
      setError("Failed to fetch invoice details.");
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle adding a split payment
  const handleSplitPayment = async () => {
    setError("");
    setSuccess("");

    const amountPaid = parseFloat(formData.amount_paid);
    const exchangeRate = formData.exchange_rate ? parseFloat(formData.exchange_rate) : null;

    // Validation
    if (!formData.customer_name || !amountPaid || amountPaid <= 0) {
      setError("Please fill out all fields correctly.");
      return;
    }

    if (["usd", "eur", "bs"].includes(formData.payment_method) && !exchangeRate) {
      setError("Exchange rate is required for foreign currency payments.");
      return;
    }

    try {
      const splitData = {
        customer_name: formData.customer_name,
        amount_paid: amountPaid,
        payment_method: formData.payment_method,
        exchange_rate: exchangeRate,
      };

      await splitBill(saleId, splitData);
      setSuccess("Payment added successfully!");

      // Refresh data
      fetchSaleDetails();
      fetchBillSplits();

      // Reset form
      setFormData({ customer_name: "", amount_paid: "", payment_method: "cash", exchange_rate: "" });

      // If bill fully paid, generate invoice
      if (remainingBalance - amountPaid <= 0) {
        fetchInvoice();
      }
    } catch (err) {
      console.error("Failed to add payment:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to add payment.");
    }
  };

  // Calculate total paid and remaining balance
  const totalPaid = billSplits.reduce((sum, split) => sum + parseFloat(split.amount_paid), 0);
  const remainingBalance = sale ? sale.total_amount - totalPaid : 0;

  // Handle invoice download
  const handleDownloadInvoice = () => {
    if (invoice?.pdf_file) {
      window.open(invoice.pdf_file, "_blank");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Split Bill & Invoice</h2>

      {loading && <div className="p-4 bg-gray-100 rounded">Loading...</div>}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {success}
        </div>
      )}

      {sale && (
        <>
          <div className="bg-gray-50 p-4 rounded shadow mb-6">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Sale Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Table:</p>
                <p className="text-gray-700">{sale.table_number}</p>
              </div>
              <div>
                <p className="font-medium">Total Amount:</p>
                <p className="text-gray-700">
                  ${sale?.total_amount ? Number(sale.total_amount).toFixed(2) : "0.00"}
                </p>
              </div>
              <div>
                <p className="font-medium">Total Paid:</p>
                <p className={`${totalPaid > 0 ? 'text-green-600' : 'text-gray-700'}`}>
                  ${totalPaid.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="font-medium">Remaining Balance:</p>
                <p className={`font-bold ${remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${remainingBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Display */}
          {invoice ? (
            <div className="bg-white p-4 rounded shadow border border-gray-200 mb-6">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Invoice</h3>
              <p className="text-gray-700">Control Code: {invoice.control_code}</p>
              <button
                onClick={handleDownloadInvoice}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200 flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Invoice (PDF)
              </button>
            </div>
          ) : (
            isGeneratingInvoice && <p className="text-green-700">Generating invoice...</p>
          )}

          {/* Add Payment Form */}
          {remainingBalance > 0 ? (
            <div className="bg-white p-4 rounded shadow border border-gray-200 mb-6">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Add Payment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    placeholder="Customer Name"
                    className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="amount_paid" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    id="amount_paid"
                    name="amount_paid"
                    value={formData.amount_paid}
                    onChange={handleInputChange}
                    placeholder="Amount Paid"
                    className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    id="payment_method"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile">Mobile Payment</option>
                    <option value="usd">US Dollars</option>
                    <option value="eur">Euros</option>
                    <option value="bs">Bolívares</option>
                  </select>
                </div>

                {["usd", "eur", "bs"].includes(formData.payment_method) && (
                  <div>
                    <label htmlFor="exchange_rate" className="block text-sm font-medium text-gray-700 mb-1">
                      Exchange Rate
                    </label>
                    <input
                      type="number"
                      id="exchange_rate"
                      name="exchange_rate"
                      value={formData.exchange_rate}
                      onChange={handleInputChange}
                      placeholder="Exchange Rate"
                      className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <button
                    onClick={handleSplitPayment}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
                  >
                    Add Payment
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-100 p-4 rounded shadow text-green-700 font-medium mb-6 text-center">
              Bill has been fully paid!
            </div>
          )}

          {/* Payment List */}
          <div className="bg-white p-4 rounded shadow border border-gray-200">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Payment History</h3>
            {billSplits.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {billSplits.map((split, index) => (
                  <li key={index} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{split.customer_name}</p>
                        <p className="text-sm text-gray-500">
                          Paid via {split.payment_method.toUpperCase()}
                          {split.exchange_rate ? ` (Rate: ${split.exchange_rate})` : ''}
                        </p>
                      </div>
                      <div className="font-bold text-green-600">
                        ${parseFloat(split.amount_paid).toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">No payments made yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default BillSplit;