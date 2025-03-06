// src/components/TableManagement/TableList.jsx
import React from "react";
import { useEffect, useState } from "react";
import { tableAPI } from "../Services/api";

function TableList() {
  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTables();
  }, [status]);

  const fetchTables = async () => {
    try {
      const data = await tableAPI.fetchTables(status !== "all" ? status : "");
      setTables(data);
    } catch (err) {
      setError("Failed to fetch tables. Please try again.");
    }
  };

  const handleReset = async (id) => {
    try {
      const response = await tableAPI.resetTable(id);
      alert(response.message);
      fetchTables();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset table.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tables</h2>

      <div className="flex gap-4 mb-6">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="free">Free</option>
          <option value="occupied">Occupied</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Table {table.table_number}</h3>
            <p>Status: {table.status}</p>
            <button
              onClick={() => handleReset(table.id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Reset Table
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableList;
