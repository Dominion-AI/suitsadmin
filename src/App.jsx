import React from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import UserList from "./components/UserList"
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import Categories from "./Inventory/Categories";
import Products from "./Inventory/Products";
import ProductDetails from "./Inventory/ProductDetails";
import StockMovement from "./Inventory/StockMovement";
import LowStockAlert from "./Inventory/LowStockAlert";
import Inventory from "./Inventory/Inventory";
import SaleManager from './Sales/SaleManager';
import Restaurant from './Restaurant/Restaurant';

// import SalesReport from './Orders/SalesReport';
// import Table from "./Table/Table";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/users" element={<UserList />} />
        </Route>

          {/* ✅ Redirect root ("/") to "/login" */}
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/stock-movement" element={<StockMovement />} />
          <Route path="/low-stock-alerts" element={<LowStockAlert />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales" element={<SaleManager />} />
          <Route path="/Restaurant" element={<Restaurant />} />

          {/* <Route path="/sales/:id" element={<SaleDetails />} /> */}
          <Route path="/products" element={<Products />} />
          {/* <Route path="/sales-reports" element={<SalesReport />} /> */}
          {/* <Route path="/table" element={<Table />} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
