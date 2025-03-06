import React from "react";
import { useState } from "react";
import { saleAPI } from "../Services/api";

function BillSplit() {
  const [saleId, setSaleId] = useState("");
  const [sale, setSale] = useState(null);
  const [splitData, setSplitData] = useState({
    customer_name: "",
    amount_paid: "",
    payment_method: "cash",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch sale details by ID
  const fetchSale = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await saleAPI.fetchSaleById(saleId);
      setSale(data);
    } catch (err) {
      setError("Sale not found or not completed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setSplitData({ ...splitData, [e.target.name]: e.target.value });
  };

  // Submit split bill data
  const handleSplitBill = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const amountPaid = parseFloat(splitData.amount_paid);

      // Check for overpayment
      if (amountPaid > sale.total_amount) {
        setError("Amount exceeds the total sale amount.");
        setLoading(false);
        return;
      }

      await saleAPI.splitBill(saleId, splitData);
      setSuccess("Bill split successfully!");
      fetchSale(); // Refresh sale data
    } catch (err) {
      setError("Failed to split the bill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Split Bill</h2>

      {/* Search Sale */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter Sale ID"
          value={saleId}
          onChange={(e) => setSaleId(e.target.value)}
          className="w-1/2 p-2 border rounded mr-2"
        />
        <button
          onClick={fetchSale}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Find Sale
        </button>
      </div>

      {/* Sale Details */}
      {loading && <p>Loading sale...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {sale && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Sale Details</h3>
          <p>
            <strong>Sale ID:</strong> {sale.id}
          </p>
          <p>
            <strong>Total Amount:</strong> ${sale.total_amount}
          </p>
          <p>
            <strong>Status:</strong> {sale.status}
          </p>
        </div>
      )}

      {/* Split Bill Form */}
      {sale && sale.status === "completed" && (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Split the Bill</h3>
          <input
            type="text"
            name="customer_name"
            placeholder="Customer Name"
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="number"
            name="amount_paid"
            placeholder="Amount Paid"
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
          />
          <select
            name="payment_method"
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="mobile">Mobile Payment</option>
            <option value="bs">Bolívares</option>
            <option value="usd">US Dollars</option>
            <option value="eur">Euros</option>
          </select>
          <button
            onClick={handleSplitBill}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Split Bill
          </button>
        </div>
      )}
    </div>
  );
}

export default BillSplit;
