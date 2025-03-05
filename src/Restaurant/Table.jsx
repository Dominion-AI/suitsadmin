// src/pages/TableManagementPage.jsx
import React from 'react';
import TableList from './TableList';
import CreateTableForm from './CreateTableForm';
import ReservationList from './ReservationList';
import CreateReservationForm from './CreateReservationForm';
import BillSplitForm from './BillSplitForm';
import KitchenOrders from './KitchenOrders';
import BarOrders from './BarOrders';



const Table = () => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
  <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Table Management</h1>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Section: Table & Reservation Forms */}
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Create Table</h2>
        <CreateTableForm />
      </div>

      <div className="bg-slate-50 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Create Reservation</h2>
        <CreateReservationForm />
      </div>

      <div className="bg-slate-50 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Split Bill</h2>
        <BillSplitForm />
      </div>
    </div>

    {/* Right Section: Lists & Orders */}
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Table List</h2>
        <TableList />
      </div>

      <div className="bg-slate-50 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Reservations</h2>
        <ReservationList />
      </div>

      <div className="bg-slate-50 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Kitchen & Bar Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KitchenOrders />
          <BarOrders />
        </div>
      </div>
    </div>
  </div>
</div>

    );
};

export default Table;
