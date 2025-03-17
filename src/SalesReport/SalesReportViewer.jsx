import React, { useState, useEffect, useRef } from "react";
import { fetchMonthlySalesReport, getProducts, getCategories, getUsers } from "../Services/api";
import ReportFilter from "./ReportFilter";
import SalesSummary from "./SalesSummary";
import SalesChart from "./SalesChart";
import ExportReportButton from "./ExportReportButton";

function SalesReportViewer() {
    const [reportData, setReportData] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ startDate: "", endDate: "", user: "", category: "" });

    // Chart refs for image capture
    const statusChartRef = useRef(null);
    const trendChartRef = useRef(null);
    const productChartRef = useRef(null);

    const loadReport = async () => {
        setLoading(true);
        try {
            const [salesReport, productData, categoryData, userData] = await Promise.all([
                fetchMonthlySalesReport(filters.startDate, filters.endDate),
                getProducts(),
                getCategories(),
                getUsers(),
            ]);

            setReportData(salesReport);
            setProducts(productData);
            setCategories(categoryData);
            setUsers(userData);
        } catch (error) {
            console.error("Failed to load sales report:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, [filters]);

    // Prepare data for export
    const salesDataForExport = reportData
        ? {
              statusData: reportData.sales_status_counts || [],
              trendData: reportData.sales_trends || [],
              topProducts: reportData.best_selling_products || [],
              totalSales: reportData.total_sales || 0,
              totalRevenue: reportData.total_revenue || 0,
              avgSaleValue: reportData.total_sales ? reportData.total_revenue / reportData.total_sales : 0,
          }
        : null;

    // Format currency 
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header with Filters and Export Button */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                                Sales Performance Dashboard
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Comprehensive analysis of your sales metrics and KPIs
                            </p>
                        </div>
                        <ExportReportButton
                            startDate={filters.startDate}
                            endDate={filters.endDate}
                            salesData={salesDataForExport}
                            chartRefs={{ statusChartRef, trendChartRef, productChartRef }}
                            disabled={!reportData || loading}
                        />
                    </div>

                    {/* Report Filters */}
                    <div>
                        <ReportFilter filters={filters} setFilters={setFilters} onFilterApply={loadReport} />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-md p-12 flex flex-col justify-center items-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-center text-lg font-medium text-gray-700">
                            Generating your sales insights...
                        </p>
                    </div>
                )}

                {/* Report Content */}
                {!loading && reportData ? (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col transform transition-all hover:scale-105">
                                <span className="text-sm font-medium text-gray-500 mb-1">Total Sales</span>
                                <span className="text-3xl font-bold text-blue-700">{reportData.total_sales.toLocaleString()}</span>
                                <div className="mt-2 flex items-center">
                                    <span className="text-green-500 text-sm font-medium">
                                        ↑ 7.2% vs. previous period
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col transform transition-all hover:scale-105">
                                <span className="text-sm font-medium text-gray-500 mb-1">Total Revenue</span>
                                <span className="text-3xl font-bold text-indigo-700">{formatCurrency(reportData.total_revenue)}</span>
                                <div className="mt-2 flex items-center">
                                    <span className="text-green-500 text-sm font-medium">
                                        ↑ 12.5% vs. previous period
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col transform transition-all hover:scale-105">
                                <span className="text-sm font-medium text-gray-500 mb-1">Avg. Sale Value</span>
                                <span className="text-3xl font-bold text-purple-700">
                                    {formatCurrency(reportData.total_sales ? reportData.total_revenue / reportData.total_sales : 0)}
                                </span>
                                <div className="mt-2 flex items-center">
                                    <span className="text-green-500 text-sm font-medium">
                                        ↑ 5.3% vs. previous period
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sales Summary */}
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-semibold text-gray-800">Performance Analysis</h2>
                                    <p className="text-gray-500 text-sm mt-1">Detailed breakdown of your sales metrics</p>
                                </div>
                                <div className="p-6">
                                    <SalesSummary 
                                        reportData={reportData} 
                                        products={products} 
                                        categories={categories} 
                                        users={users} 
                                    />
                                </div>
                            </div>

                            {/* Sales Chart */}
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-semibold text-gray-800">Sales Visualization</h2>
                                    <p className="text-gray-500 text-sm mt-1">Graphical representation of your sales data</p>
                                </div>
                                <div className="p-6">
                                    <SalesChart
                                        statusCounts={reportData.sales_status_counts}
                                        revenueByCurrency={reportData.revenue_by_currency}
                                        bestSellingProducts={reportData.best_selling_products}
                                        salesByCategory={reportData.sales_by_category}
                                        salesByUser={reportData.sales_by_user}
                                        statusChartRef={statusChartRef}
                                        trendChartRef={trendChartRef}
                                        productChartRef={productChartRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    !loading && (
                        <div className="bg-white rounded-xl shadow-md p-12 flex flex-col justify-center items-center">
                            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <p className="text-center text-lg font-medium text-gray-700 mb-2">
                                No data available for the selected period
                            </p>
                            <p className="text-center text-gray-500">
                                Try adjusting your filters or selecting a different date range
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default SalesReportViewer;