import React, { useState, useEffect } from "react";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, BarElement } from "chart.js";
import { getSales } from "../Services/api"; // Your existing API function
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";

Chart.register(ArcElement, Tooltip, Legend, LineElement, PointElement, BarElement, CategoryScale, LinearScale);

/**
 * Count sales status and calculate revenue.
 */
function countSalesStatus(sales) {
    if (!Array.isArray(sales) || sales.length === 0) {
        console.warn("No sales data provided — showing fallback counts.");
        return [
            { status: "completed", count: 0, totalAmount: 0 },
            { status: "pending", count: 0, totalAmount: 0 },
            { status: "cancelled", count: 0, totalAmount: 0 },
        ];
    }

    const statusCounts = { completed: { count: 0, totalAmount: 0 }, pending: { count: 0, totalAmount: 0 }, cancelled: { count: 0, totalAmount: 0 } };

    sales.forEach((sale) => {
        if (sale.status && statusCounts.hasOwnProperty(sale.status)) {
            statusCounts[sale.status].count += 1;
            statusCounts[sale.status].totalAmount += parseFloat(sale.total_amount || 0);
        }
    });

    return Object.entries(statusCounts).map(([status, data]) => ({
        status,
        count: data.count,
        totalAmount: data.totalAmount,
    }));
}

/**
 * Group sales by date for trend chart.
 */
function groupSalesByDate(sales) {
    const dateCounts = {};

    sales.forEach((sale) => {
        const date = new Date(sale.created_at).toLocaleDateString();
        if (!dateCounts[date]) {
            dateCounts[date] = { count: 0, totalAmount: 0 };
        }
        dateCounts[date].count += 1;
        dateCounts[date].totalAmount += parseFloat(sale.total_amount || 0);
    });

    return Object.entries(dateCounts)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .map(([date, data]) => ({
            date,
            count: data.count,
            totalAmount: data.totalAmount,
        }));
}

/**
 * Count top-selling products.
 */
function countTopSellingProducts(sales) {
    const productCounts = {};

    sales.forEach((sale) => {
        sale.items?.forEach((item) => {
            const productName = item.product_name || "Unknown Product";
            if (!productCounts[productName]) {
                productCounts[productName] = { quantity: 0, totalAmount: 0 };
            }
            productCounts[productName].quantity += item.quantity;
            productCounts[productName].totalAmount += parseFloat(item.total_price || 0);
        });
    });

    return Object.entries(productCounts)
        .map(([product, data]) => ({
            product,
            quantity: data.quantity,
            totalAmount: data.totalAmount,
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5); // Only show top 5 products
}

/**
 * SalesStatusChart Component
 */
function SaleStatusChart() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState("all"); // "all", "month", "week"
    const [selectedChart, setSelectedChart] = useState("status"); // "status", "trend", "products"

    /**
     * Fetch sales data from API
     */
    const fetchSalesData = async () => {
        try {
            const salesData = await getSales();
            console.log("Full API response:", salesData);

            if (Array.isArray(salesData)) {
                setSales(salesData);
            } else if (salesData.results && Array.isArray(salesData.results)) {
                setSales(salesData.results);
            } else {
                console.warn("Unexpected API response format or no sales data");
                setSales([]);
            }
        } catch (error) {
            console.error("Error fetching sales data:", error);
            setError(error.message);
            setSales([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load sales data on component mount
     */
    useEffect(() => {
        fetchSalesData();
    }, []);

    // Filter sales data based on selected time range
    const filteredSales = sales.filter(sale => {
        if (timeRange === "all") return true;
        
        const saleDate = new Date(sale.created_at);
        const now = new Date();
        
        if (timeRange === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return saleDate >= weekAgo;
        }
        
        if (timeRange === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            return saleDate >= monthAgo;
        }
        
        return true;
    });

    const statusData = countSalesStatus(filteredSales);
    const trendData = groupSalesByDate(filteredSales);
    const topProducts = countTopSellingProducts(filteredSales);

    // Calculate KPIs
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0);
    const avgSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    
    // Compare current period with previous period for growth indicators
    const previousPeriodSales = timeRange === "week" ? 
        sales.filter(sale => {
            const saleDate = new Date(sale.created_at);
            const twoWeeksAgo = new Date();
            const oneWeekAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return saleDate >= twoWeeksAgo && saleDate < oneWeekAgo;
        }).length : 
        (timeRange === "month" ? 
            sales.filter(sale => {
                const saleDate = new Date(sale.created_at);
                const twoMonthsAgo = new Date();
                const oneMonthAgo = new Date();
                twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                return saleDate >= twoMonthsAgo && saleDate < oneMonthAgo;
            }).length : 0);
    
    const salesGrowth = previousPeriodSales > 0 ? ((totalSales - previousPeriodSales) / previousPeriodSales) * 100 : 0;

    // Prepare Doughnut Chart for Sales Status
    const doughnutData = {
        labels: statusData.map((item) => item.status.charAt(0).toUpperCase() + item.status.slice(1)),
        datasets: [
            {
                label: "Number of Sales",
                data: statusData.map((item) => item.count),
                backgroundColor: ["#10B981", "#FBBF24", "#EF4444"],
                borderColor: ["#064E3B", "#78350F", "#7F1D1D"],
                borderWidth: 1,
                hoverOffset: 4,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const data = statusData[tooltipItem.dataIndex];
                        return `${data.count} sales ($${data.totalAmount.toLocaleString()})`;
                    },
                },
            },
            legend: { position: "bottom" },
        },
        maintainAspectRatio: false,
        responsive: true,
    };

    // Trend Chart Options
    const trendOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const dataIndex = tooltipItem.dataIndex;
                        const data = trendData[dataIndex];
                        return `${tooltipItem.dataset.label}: ${data.count} sales ($${data.totalAmount.toLocaleString()})`;
                    },
                },
            },
            legend: { position: "top" },
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Sales'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            }
        }
    };

    // Products Chart Options
    const productOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const dataIndex = tooltipItem.dataIndex;
                        const data = topProducts[dataIndex];
                        return `Quantity: ${data.quantity} ($${data.totalAmount.toLocaleString()})`;
                    },
                },
            },
            legend: { display: false },
        },
        maintainAspectRatio: false,
        responsive: true,
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Quantity Sold'
                }
            }
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64 w-full bg-gray-50 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600">{error}</p>
            <button 
                onClick={fetchSalesData} 
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
                Try Again
            </button>
        </div>
    );

    return (
        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-white p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Sales Dashboard</h2>
                    
                    {/* Time Range Selector */}
                    <div className="flex mt-4 md:mt-0 space-x-2">
                        <button 
                            onClick={() => setTimeRange("week")} 
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                timeRange === "week" 
                                    ? "bg-blue-600 text-white" 
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            Last 7 Days
                        </button>
                        <button 
                            onClick={() => setTimeRange("month")} 
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                timeRange === "month" 
                                    ? "bg-blue-600 text-white" 
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            Last 30 Days
                        </button>
                        <button 
                            onClick={() => setTimeRange("all")} 
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                timeRange === "all" 
                                    ? "bg-blue-600 text-white" 
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            All Time
                        </button>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <ShoppingCart size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Sales</p>
                            <h3 className="text-2xl font-bold text-gray-800">{totalSales.toLocaleString()}</h3>
                        </div>
                    </div>
                    {salesGrowth !== 0 && (
                        <div className="mt-4 flex items-center">
                            {salesGrowth > 0 ? (
                                <ArrowUpRight className="text-green-500 mr-1" size={16} />
                            ) : (
                                <ArrowDownRight className="text-red-500 mr-1" size={16} />
                            )}
                            <span className={`text-sm font-medium ${salesGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {Math.abs(salesGrowth).toFixed(1)}% from previous period
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Avg Sale Value</p>
                            <h3 className="text-2xl font-bold text-gray-800">${avgSaleValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Tabs */}
            <div className="px-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setSelectedChart("status")}
                            className={`py-4 px-6 text-sm font-medium ${
                                selectedChart === "status"
                                    ? "border-b-2 border-blue-500 text-blue-600"
                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
                            }`}
                        >
                            Status Breakdown
                        </button>
                        <button
                            onClick={() => setSelectedChart("trend")}
                            className={`py-4 px-6 text-sm font-medium ${
                                selectedChart === "trend"
                                    ? "border-b-2 border-blue-500 text-blue-600"
                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
                            }`}
                        >
                            Sales Trend
                        </button>
                        <button
                            onClick={() => setSelectedChart("products")}
                            className={`py-4 px-6 text-sm font-medium ${
                                selectedChart === "products"
                                    ? "border-b-2 border-blue-500 text-blue-600"
                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
                            }`}
                        >
                            Top Products
                        </button>
                    </nav>
                </div>
            </div>

            {/* Chart Content */}
            <div className="p-6">
                {selectedChart === "status" && (
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales Status Breakdown</h3>
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/2 h-64">
                                    <Doughnut data={doughnutData} options={chartOptions} />
                                </div>
                                <div className="w-full md:w-1/2 mt-6 md:mt-0">
                                    <div className="space-y-4">
                                        {statusData.map((status) => (
                                            <div key={status.status} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div 
                                                        className={`w-3 h-3 rounded-full mr-2 ${
                                                            status.status === "completed" ? "bg-green-500" :
                                                            status.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                                                        }`}
                                                    ></div>
                                                    <span className="text-sm font-medium text-gray-700 capitalize">{status.status}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-gray-800">{status.count} sales</p>
                                                    <p className="text-xs text-gray-500">${status.totalAmount.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedChart === "trend" && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales Trend Over Time</h3>
                        <div className="h-80">
                            <Line 
                                data={{
                                    labels: trendData.map((item) => item.date),
                                    datasets: [
                                        {
                                            label: "Number of Sales",
                                            data: trendData.map((item) => item.count),
                                            borderColor: "#3B82F6",
                                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                                            fill: true,
                                            tension: 0.4,
                                            pointBackgroundColor: "#3B82F6",
                                            pointBorderColor: "#fff",
                                            pointBorderWidth: 2,
                                            pointRadius: 4,
                                            pointHoverRadius: 6,
                                        },
                                    ],
                                }} 
                                options={trendOptions} 
                            />
                        </div>
                    </div>
                )}

                {selectedChart === "products" && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Top-Selling Products</h3>
                            <div className="flex items-center">
                                <Package size={16} className="text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">Showing top {topProducts.length} products</span>
                            </div>
                        </div>
                        <div className="h-80">
                            <Bar 
                                data={{
                                    labels: topProducts.map((item) => item.product.length > 25 ? item.product.substring(0, 22) + '...' : item.product),
                                    datasets: [
                                        {
                                            label: "Quantity Sold",
                                            data: topProducts.map((item) => item.quantity),
                                            backgroundColor: "rgba(79, 70, 229, 0.8)",
                                            borderColor: "rgba(79, 70, 229, 1)",
                                            borderWidth: 1,
                                            borderRadius: 4,
                                        },
                                    ],
                                }} 
                                options={productOptions} 
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SaleStatusChart;