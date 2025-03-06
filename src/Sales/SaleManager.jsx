import React from "react";
import { useState, useEffect } from 'react';
import { 
  Package, 
  List, 
  PlusCircle, 
  FileText, 
  RefreshCw 
} from 'lucide-react';
import { getSales, generateInvoice } from '../Services/api';
import SaleList from './SaleList';
import SaleDetails from './SaleDatails';

import SaleForm from './SaleForm';

const SaleManager = () => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [view, setView] = useState('list');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error('Failed to fetch sales:', error);
      setError('Failed to fetch sales. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
    setView('details');
  };

  const handleGenerateInvoice = async (saleId) => {
    try {
      const invoiceData = await generateInvoice(saleId);
  
      if (invoiceData && invoiceData.pdf_file) {
        const invoiceUrl = `https://suitsadmin.onrender.com${invoiceData.pdf_file}`;
        window.open(invoiceUrl, "_blank");
      } else {
        throw new Error("Invoice URL not found");
      }
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      setError("Failed to generate invoice. Please try again.");
    }
  };

  const handleBackToList = () => {
    setSelectedSale(null);
    setView('list');
  };

  const handleSaleCreated = (newSale) => {
    setSales([newSale, ...sales]);
    setView('list');
  };

  const renderContent = () => {
    switch(view) {
      case 'create':
        return (
          <SaleForm 
            onSaleCreated={handleSaleCreated} 
            onCancel={() => setView('list')}
          />
        );
      case 'details':
        return (
          <SaleDetails 
            sale={selectedSale} 
            onBack={handleBackToList} 
            onGenerateInvoice={() => handleGenerateInvoice(selectedSale.id)}
          />
        );
      default:
        return (
          <SaleList
            sales={sales}
            onViewDetails={handleViewDetails}
            onGenerateInvoice={handleGenerateInvoice}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header with Tabs and Actions */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-extrabold flex items-center">
              <Package className="mr-3" size={32} />
              Sales Management
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setView('list')}
                className={`flex items-center px-4 py-2 rounded-lg transition duration-300 ${
                  view === 'list' 
                    ? 'bg-white text-teal-600' 
                    : 'hover:bg-white/20'
                }`}
              >
                <List className="mr-2" size={20} />
                Sales List
              </button>
              <button
                onClick={() => setView('create')}
                className={`flex items-center px-4 py-2 rounded-lg transition duration-300 ${
                  view === 'create' 
                    ? 'bg-white text-teal-600' 
                    : 'hover:bg-white/20'
                }`}
              >
                <PlusCircle className="mr-2" size={20} />
                Create Sale
              </button>
              <button
                onClick={fetchSales}
                disabled={isLoading}
                className="flex items-center px-4 py-2 rounded-lg hover:bg-white/20 transition duration-300"
              >
                <RefreshCw 
                  className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} 
                  size={20} 
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-4">
            <p className="flex items-center">
              <FileText className="mr-2" size={20} />
              {error}
            </p>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SaleManager;