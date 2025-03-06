import React from "react";
import TableList from "./TableList";
import ReservationForm from "./ReservationForm";
import InvoiceGenerator from "./InvoiceGenerator";
import OrderList from "./OrderList";
import RestaurantHeader from "./RestaurantHeader";
import BillSplit from "./BillSplit";

function Restaurant() {
  return (
    <div>
      <RestaurantHeader />
      <TableList />
      <ReservationForm />
      <InvoiceGenerator />
      <OrderList />
      <BillSplit />
    </div>
  );
}

export default Restaurant;
