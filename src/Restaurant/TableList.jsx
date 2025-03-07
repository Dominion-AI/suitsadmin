import React, { useEffect, useState } from "react";
import { tableAPI } from "../Services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TableList() {
  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [activeTableId, setActiveTableId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchTables();
  }, [status]);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const data = await tableAPI.fetchTables(status !== "all" ? status : "");
      setTables(data);
    } catch (err) {
      toast.error("Failed to fetch tables. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (id) => {
    if (!window.confirm("Are you sure you want to reset this table?")) return;

    setActiveTableId(id);
    setResetLoading(true);
    try {
      const response = await tableAPI.resetTable(id);
      toast.success(response.message);
      fetchTables(); // Refresh the table list
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reset table.");
    } finally {
      setResetLoading(false);
      setActiveTableId(null);
    }
  };

  const filteredTables = tables.filter(table => 
    table.table_number.toString().includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case "free":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Free</span>;
      case "occupied":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Occupied</span>;
      case "reserved":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Reserved</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Tables Overview</h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search table number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <svg 
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          
          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="free">Free</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
          </select>
          
          {/* View Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredTables.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tables found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTables.map((table) => (
            <div
              key={table.id}
              className={`bg-white p-6 rounded-lg shadow-md transition duration-200 hover:shadow-lg 
                ${table.status === "occupied" ? "border-l-4 border-red-500" : 
                  table.status === "free" ? "border-l-4 border-green-500" : 
                  "border-l-4 border-yellow-500"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Table {table.table_number}</h3>
                {getStatusBadge(table.status)}
              </div>
              
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600">Capacity: <span className="font-medium">{table.capacity || 4} people</span></p>
                <p className="text-sm text-gray-600">Location: <span className="font-medium">{table.location || "Main Area"}</span></p>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={() => handleReset(table.id)}
                  disabled={table.status !== "occupied" || (resetLoading && activeTableId === table.id)}
                  className={`w-full text-white px-4 py-2 rounded-md transition duration-200 
                    ${table.status !== "occupied"
                      ? "bg-gray-300 cursor-not-allowed"
                      : resetLoading && activeTableId === table.id
                      ? "bg-gray-500"
                      : "bg-red-500 hover:bg-red-600 shadow hover:shadow-md"
                    }`}
                >
                  {resetLoading && activeTableId === table.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting...
                    </span>
                  ) : (
                    "Reset Table"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table #</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTables.map((table) => (
                <tr key={table.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Table {table.table_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(table.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{table.capacity || 4} people</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{table.location || "Main Area"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleReset(table.id)}
                      disabled={table.status !== "occupied" || (resetLoading && activeTableId === table.id)}
                      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded 
                        ${table.status !== "occupied"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : resetLoading && activeTableId === table.id
                          ? "bg-gray-300 text-gray-700"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                    >
                      {resetLoading && activeTableId === table.id ? (
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={fetchTables}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
        <p className="text-sm text-gray-500">Showing {filteredTables.length} of {tables.length} tables</p>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default TableList;