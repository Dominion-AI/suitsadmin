// StockMovement.jsx
import React, { useState } from 'react';
import inventoryAPI from '../Services/api';
import InventoryForm from './InventoryForm';

const StockMovement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addStockMovement = async (movementData) => {
    setLoading(true);
    setError('');

    try {
      await inventoryAPI.addStockMovement(movementData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add stock movement. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Movement</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <InventoryForm
        onSubmit={addStockMovement}
        fields={[
          { name: 'product', label: 'Product ID', type: 'number' },
          { name: 'movement_type', label: 'Movement Type' },
          { name: 'quantity', label: 'Quantity', type: 'number' },
        ]}
      />
    </div>
  );
};

export default StockMovement;