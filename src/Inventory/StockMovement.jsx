import React, { useState } from "react";
import { createStockMovement } from "../Services/api";
import PropTypes from 'prop-types';

const StockMovement = ({ productId, onStockUpdated }) => {
  const [movementType, setMovementType] = useState("add");
  const [quantity, setQuantity] = useState("");

  const handleStockMovement = async () => {
    try {
      await createStockMovement({ product: productId, movement_type: movementType, quantity: parseInt(quantity) });
      onStockUpdated();
      setQuantity("");
    } catch (error) {
      console.error("Stock movement failed:", error.response?.data || error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select value={movementType} onChange={(e) => setMovementType(e.target.value)}>
        <option value="add">Add Stock</option>
        <option value="remove">Remove Stock</option>
      </select>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        className="p-2 border rounded"
      />
      <button onClick={handleStockMovement} className="bg-blue-500 text-white px-4 py-2 rounded">
        Update Stock
      </button>
    </div>
  );
};

StockMovement.propTypes = {
  productId: PropTypes.number.isRequired, // Changed from PropTypes.func to PropTypes.number
  onStockUpdated: PropTypes.func.isRequired
};


export default StockMovement;
