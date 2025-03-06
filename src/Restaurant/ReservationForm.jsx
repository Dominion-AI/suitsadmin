import React from "react";
import { useState, useEffect } from "react";
import { reservationAPI } from "../Services/api";

function ReservationForm() {
  const [formData, setFormData] = useState({
    table: "",
    customer_name: "",
    reservation_time: "",
  });
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await reservationAPI.fetchReservations();
      setReservations(data);
    } catch (err) {
      setError("Failed to fetch reservations.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await reservationAPI.createReservation(formData);
      setSuccess("Reservation created successfully!");
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create reservation.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Reservation</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="table"
          placeholder="Table ID"
          className="w-full p-2 border"
          onChange={handleChange}
        />
        <input
          type="text"
          name="customer_name"
          placeholder="Customer Name"
          className="w-full p-2 border"
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="reservation_time"
          className="w-full p-2 border"
          onChange={handleChange}
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Reservation
        </button>
      </form>

      <h3 className="text-xl font-bold mt-6">Reservations</h3>
      <ul>
        {reservations.map((res) => (
          <li key={res.id}>
            {res.customer_name} at Table {res.table_number} on {res.reservation_time}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReservationForm;
