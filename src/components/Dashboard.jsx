import React, { useState, useEffect, useMemo } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import api from '../Services/api';
import { 
  LogOut, 
  Clock, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  FileText, 
  BarChart3, 
  User,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const currentPath = location.pathname;
  const isDashboardHome = currentPath === "/dashboard";

  // Navigation card data
  const navCards = useMemo(() => [
    {
      title: "Security Log",
      description: "Handle security measures by the Admin",
      icon: <LayoutDashboard className="h-6 w-6 text-white" />,
      path: "/security",
      color: "from-red-700 to-red-600"
    },
    {
      title: "Inventory Management",
      description: "Track and manage product inventory and stock levels",
      icon: <Package className="h-6 w-6 text-white" />,
      path: "/inventory",
      color: "from-teal-700 to-teal-600"
    },
    {
      title: "Sales Processing",
      description: "View and process customer sales and transactions",
      icon: <ShoppingCart className="h-6 w-6 text-white" />,
      path: "/sales",
      color: "from-sky-700 to-sky-600"
    },
    {
      title: "Restaurants",
      description: "Access and manage restaurant data and configurations",
      icon: <FileText className="h-6 w-6 text-white" />,
      path: "/restaurant",
      color: "from-violet-700 to-violet-600"
    },
    {
      title: "Billing System",
      description: "Process payments and manage financial transactions",
      icon: <CreditCard className="h-6 w-6 text-white" />,
      path: "/billing",
      color: "from-indigo-700 to-indigo-600"
    },
    {
      title: "Reports & Analytics",
      description: "Generate and view business performance reports",
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      path: "/sales-report",
      color: "from-blue-700 to-blue-600"
    }
  ], []);

  const currentPageTitle = useMemo(() => 
    navCards.find(card => card.path === currentPath)?.title || "Current Page"
  , [currentPath, navCards]);

  // Update the time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch user details
  
  
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  // Card navigation component
  const CardNavigation = () => (
    <div className="mb-8">
      <h1 className="text-xl font-bold text-slate-800 mb-2">
        Welcome, User
      </h1>
      <p className="text-slate-500 text-sm mb-8">Select a module to get started</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navCards.map((card) => (
          <Link 
            key={card.path}
            to={card.path}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full hover:translate-y-px"
          >
            <div className={`bg-gradient-to-r ${card.color} p-4`}>
              <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                {card.icon}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-medium text-base text-slate-800 mb-2">{card.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed flex-1">{card.description}</p>
              <div className="flex items-center text-slate-600 font-medium text-xs mt-4 group">
                <span className="group-hover:text-slate-800 transition-colors">Access Module</span>
                <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  // Breadcrumbs component
  const Breadcrumbs = () => (
    <div className="flex items-center text-xs text-slate-500 mb-6">
      <Link to="/dashboard" className="hover:text-slate-800">Dashboard</Link>
      <ChevronRight className="h-3 w-3 mx-2" />
      <span className="font-medium text-slate-800">{currentPageTitle}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 text-transparent bg-clip-text">
                SuitsAdmin
              </Link>
            </div>

            {/* Navigation Links - Horizontal Top Menu */}
            {!isDashboardHome && (
              <div className="hidden md:flex space-x-1">
                {navCards.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      currentPath === item.path 
                        ? "bg-slate-100 text-slate-800" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Date and Time */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 shadow-sm">
                <Clock className="h-4 w-4 text-slate-600" />
                <span className="text-xs font-medium text-slate-700">
                  {currentTime}
                </span>
              </div>

              {/* User Profile Section */}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 text-xs font-medium transition-colors shadow-sm hover:shadow-md"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Content */}
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-xs font-medium">
              {error}
            </div>
          )}

          {/* Breadcrumbs Navigation */}
          {!isDashboardHome && <Breadcrumbs />}

          {/* Card-based Navigation Menu (only on dashboard home) */}
          {isDashboardHome ? <CardNavigation /> : <Outlet />}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs font-medium text-slate-500">
        &copy; {new Date().getFullYear()} SuitsAdmin. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;