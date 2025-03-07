import React, { useEffect, useState } from "react";
import { getSaleById, splitBill, getBillSplits } from "../Services/api";

function BillSplit({ saleId }) {
  const [sale, setSale] = useState(null);
  const [billSplits, setBillSplits] = useState([]);
  const [formData, setFormData] = useState({
    customer_name: "",
    amount_paid: "",
    payment_method: "cash",
    exchange_rate: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch sale and existing bill splits
  useEffect(() => {
    console.log("Sale ID passed to BillSplit component:", saleId);

    if (saleId) {
      fetchSaleDetails();
      fetchBillSplits();
    } else {
      console.warn("No sale ID provided. Skipping fetch.");
      setError("No sale ID provided. Please select a sale.");
      setLoading(false);
    }
  }, [saleId]);

  const fetchSaleDetails = async () => {
    try {
      setLoading(true);
      const saleData = await getSaleById(saleId);
      setSale(saleData);
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
      console.log("Fetched Bill Splits:", splits);
      setBillSplits(splits);
    } catch (err) {
      setError("Failed to fetch bill splits.");
      console.error("Fetch Bill Splits Error:", err.response?.data || err.message);
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

      console.log("Split Data Sent to API:", splitData);

      await splitBill(saleId, splitData);
      setSuccess("Payment added successfully!");

      // Refresh data
      fetchSaleDetails();
      fetchBillSplits();

      // Reset form
      setFormData({ customer_name: "", amount_paid: "", payment_method: "cash", exchange_rate: "" });
    } catch (err) {
      console.error("Failed to add payment:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to add payment.");
    }
  };

  // Calculate total paid and remaining balance
  const totalPaid = billSplits.reduce((sum, split) => sum + parseFloat(split.amount_paid), 0);
  const remainingBalance = sale ? sale.total_amount - totalPaid : 0;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Split Bill</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {sale && (
        <>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-xl font-bold mb-4">Sale Details</h3>
            <p>
              <strong>Table:</strong> {sale.table_number}
            </p>
            <p>
              <strong>Total Amount:</strong> ${sale.total_amount.toFixed(2)}
            </p>
            <p>
              <strong>Total Paid:</strong> ${totalPaid.toFixed(2)}
            </p>
            <p>
              <strong>Remaining Balance:</strong> ${remainingBalance.toFixed(2)}
            </p>
          </div>

          {/* Add Payment Form */}
          {remainingBalance > 0 && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold mb-4">Add Payment</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="Customer Name"
                  className="p-2 border rounded"
                />

                <input
                  type="number"
                  name="amount_paid"
                  value={formData.amount_paid}
                  onChange={handleInputChange}
                  placeholder="Amount Paid"
                  className="p-2 border rounded"
                />

                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="mobile">Mobile Payment</option>
                  <option value="usd">US Dollars</option>
                  <option value="eur">Euros</option>
                  <option value="bs">Bolívares</option>
                </select>

                {["usd", "eur", "bs"].includes(formData.payment_method) && (
                  <input
                    type="number"
                    name="exchange_rate"
                    value={formData.exchange_rate}
                    onChange={handleInputChange}
                    placeholder="Exchange Rate"
                    className="p-2 border rounded"
                  />
                )}

                <button
                  onClick={handleSplitPayment}
                  className="bg-blue-500 text-white px-4 py-2 rounded col-span-2"
                >
                  Add Payment
                </button>
              </div>
            </div>
          )}

          {/* Payment List */}
          <div className="bg-white p-4 rounded shadow mt-6">
            <h3 className="text-xl font-bold mb-4">Payments</h3>
            {billSplits.length > 0 ? (
              <ul>
                {billSplits.map((split, index) => (
                  <li key={index} className="border-b p-4">
                    <p>
                      <strong>{split.customer_name}</strong> paid ${parseFloat(split.amount_paid).toFixed(2)} via{" "}
                      {split.payment_method.toUpperCase()}
                    </p>
                    {split.exchange_rate && (
                      <p>
                        <strong>Exchange Rate:</strong> {split.exchange_rate}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No payments made yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default BillSplit;
