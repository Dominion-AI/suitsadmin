import React, { useState } from "react";
import TableList from "./TableList";
import ReservationForm from "./ReservationForm";
import InvoiceGenerator from "./InvoiceGenerator";
import OrderList from "./OrderList";
import BillSplit from "./BillSplit";
import { Calendar, Users, ShoppingCart, FileText, Receipt } from "lucide-react";

function Restaurant() {
  const [activeTab, setActiveTab] = useState("table");

  const renderContent = () => {
    switch (activeTab) {
      case "reservations":
        return <ReservationForm />;
      case "table":
        return <TableList />;
      case "orders":
        return <OrderList />;
      case "bills":
        return <BillSplit />;
      case "invoice":
        return <InvoiceGenerator />;
      default:
        return <TableList />;
    }
  };

  // Tab configuration - now matches switch case order
  const tabs = [
    { id: "reservations", label: "Reservations", icon: <Calendar className="w-5 h-5 mr-2" /> },
    { id: "table", label: "Tables", icon: <Users className="w-5 h-5 mr-2" /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart className="w-5 h-5 mr-2" /> },
    { id: "bills", label: "Split Bills", icon: <Receipt className="w-5 h-5 mr-2" /> },
    { id: "invoice", label: "Invoice", icon: <FileText className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6 flex-grow">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Restaurant Management</h1>
          <p className="text-gray-600">Manage all your restaurant operations in one place</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex flex-wrap space-x-1 md:space-x-6" aria-label="Restaurant management">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-indigo-500 hover:border-indigo-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dynamic Content Area with nicer styling */}
        <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
          <div className="animate-fadeIn">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Footer with improved styling */}
      <footer className="bg-indigo-600 text-white py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">Restaurant Management System © {new Date().getFullYear()}</p>
            <div className="mt-2 md:mt-0 flex space-x-4">
              <a href="#" className="text-indigo-200 hover:text-white text-sm">Help</a>
              <a href="#" className="text-indigo-200 hover:text-white text-sm">Support</a>
              <a href="#" className="text-indigo-200 hover:text-white text-sm">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Add a simple fade-in animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`;
document.head.appendChild(style);

export default Restaurant;