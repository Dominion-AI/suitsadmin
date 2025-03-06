import React from "react";
import { Link } from "react-router-dom";
function RestaurantHeader() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <div>
          <Link to="/reservations" className="mr-4">Reservations</Link>
          <Link to="/sales">Sales</Link>
        </div>
      </div>
    </nav>
  );
}

export default RestaurantHeader;
