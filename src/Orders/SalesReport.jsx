import React, { useEffect, useState } from 'react';
import { getSalesReports } from '../Services/orderApi';

const SalesReport = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getSalesReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch sales reports:', error);
    }
  };

  return (
    <div>
      <h1>Sales Reports</h1>
      <ul>
        {reports.map((report, index) => (
          <li key={index}>{report.date}: ${report.total_sales}</li>
        ))}
      </ul>
    </div>
  );
};

export default SalesReport;


