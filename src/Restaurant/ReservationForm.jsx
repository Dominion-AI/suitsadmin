import React, { useState, useEffect } from "react";
import { reservationAPI } from "../Services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ReservationForm() {
  const [formData, setFormData] = useState({
    table: "",
    customer_name: "",
    reservation_time: "",
    phone: "",
    guests: "2",
    notes: ""
  });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState("upcoming");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationAPI.fetchReservations();
      setReservations(data);
    } catch (err) {
      toast.error("Failed to fetch reservations.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.table || !formData.customer_name || !formData.reservation_time) {
      toast.error("Please fill out all required fields.");
      return;
    }

    // Block past dates
    const selectedDate = new Date(formData.reservation_time);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      toast.error("Reservation time cannot be in the past.");
      return;
    }

    setFormLoading(true);
    try {
      const response = await reservationAPI.createReservation(formData);
      toast.success("Reservation created successfully!");
      setFormData({ 
        table: "", 
        customer_name: "", 
        reservation_time: "",
        phone: "",
        guests: "2",
        notes: ""
      }); // Reset form
      fetchReservations(); // Refresh reservations list
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create reservation.");
    } finally {
      setFormLoading(false);
    }
  };

  // Filter reservations based on view mode
  const filteredReservations = reservations.filter(res => {
    const reservationDate = new Date(res.reservation_time);
    const now = new Date();
    
    if (viewMode === "upcoming") {
      return reservationDate >= now;
    } else if (viewMode === "past") {
      return reservationDate < now;
    }
    return true; // "all" view
  });

  // Sort reservations by date (newest first for upcoming, oldest first for past)
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    const dateA = new Date(a.reservation_time);
    const dateB = new Date(b.reservation_time);
    return viewMode === "past" ? dateA - dateB : dateB - dateA;
  });

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Reservation Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Reservation</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                <input
                  type="number"
                  name="table"
                  placeholder="Enter table number"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.table}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                <select
                  name="guests"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.guests}
                  onChange={handleChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                name="customer_name"
                placeholder="Enter customer name"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.customer_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Time</label>
              <input
                type="datetime-local"
                name="reservation_time"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.reservation_time}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
              <textarea
                name="notes"
                placeholder="Any special requests or notes"
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className={`w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200 ${
                formLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700 shadow-md hover:shadow-lg"
              }`}
            >
              {formLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Reservation...
                </span>
              ) : (
                "Create Reservation"
              )}
            </button>
          </form>
        </div>

        {/* Right Column - Reservations List */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Reservations</h3>
            
            <div className="flex">
              <button
                onClick={() => setViewMode("upcoming")}
                className={`px-3 py-1 text-sm rounded-l-lg ${
                  viewMode === "upcoming" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 border-gray-300 border"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setViewMode("past")}
                className={`px-3 py-1 text-sm ${
                  viewMode === "past" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 border-gray-300 border-t border-b"
                }`}
              >
                Past
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-3 py-1 text-sm rounded-r-lg ${
                  viewMode === "all" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 border-gray-300 border"
                }`}
              >
                All
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : sortedReservations.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
              <p className="text-gray-500">
                {viewMode === "upcoming" 
                  ? "There are no upcoming reservations" 
                  : viewMode === "past" 
                  ? "There are no past reservations" 
                  : "There are no reservations"}
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {sortedReservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{res.customer_name}</h4>
                      <p className="text-gray-600 text-sm">
                        <span className="inline-flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {formatDate(res.reservation_time)}
                        </span>
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        <span className="inline-flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                          </svg>
                          Table {res.table_number}
                        </span>
                        {res.guests && 
                          <span className="inline-flex items-center ml-3">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                            {res.guests} {res.guests === 1 ? 'guest' : 'guests'}
                          </span>
                        }
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800 rounded">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-800 rounded">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  {res.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-gray-600 text-sm italic">{res.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={fetchReservations}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh Reservations
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default ReservationForm;