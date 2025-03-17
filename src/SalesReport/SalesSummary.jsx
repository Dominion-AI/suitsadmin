import React from 'react';
import PropTypes from 'prop-types';

function SaleSummary({ reportData, products, categories, users }) {
    if (!reportData || !products || !categories || !users) {
        return (
            <div className="p-8 bg-gray-50 rounded-lg text-center shadow-sm">
                <div className="flex flex-col items-center">
                    <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
                    <div className="h-24 w-full max-w-md bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <p className="mt-4 text-gray-500">Loading sales data...</p>
            </div>
        );
    }

    // Extract and normalize data
    const total_sales = reportData.total_sales || 0;
    const total_revenue = reportData.total_revenue || 0;
    const revenue_by_currency = reportData.revenue_by_currency || [];

    // Calculate category-wise product counts
    const categoryProductCounts = getCategoryProductCounts(products, categories);

    // Calculate user role counts
    const userRoleCounts = getUserRoleCounts(users);

    // Find the best-selling product
    const bestSellingProduct = getBestSellingProduct(products);

    // Helper function to calculate product counts by category
    function getCategoryProductCounts(products, categories) {
        const categoryMap = new Map();

        // Initialize category counts to 0
        categories.forEach((category) => {
            categoryMap.set(category.id, { name: category.name, count: 0 });
        });

        // Count products in each category
        products.forEach((product) => {
            const categoryId = product.category_id || product.category;
            if (categoryId && categoryMap.has(categoryId)) {
                const category = categoryMap.get(categoryId);
                category.count += 1;
            }
        });

        return Array.from(categoryMap.values());
    }

    // Helper function to calculate user role counts
    function getUserRoleCounts(users) {
        return users.reduce((acc, user) => {
            if (user.role) {
                acc[user.role] = (acc[user.role] || 0) + 1;
            }
            return acc;
        }, { admin: 0, cashier: 0, owner: 0 });
    }

    // Helper function to get the best-selling product
    function getBestSellingProduct(products) {
        if (!products || products.length === 0) return null;

        // Find the product with the highest sales
        return products.reduce((topProduct, currentProduct) => {
            return currentProduct.total_sales > (topProduct?.total_sales || 0)
                ? currentProduct
                : topProduct;
        }, null);
    }

    // Helper function to determine progress
    const getPercentage = (value, target) => {
        const percentage = Math.min((value / target) * 100, 100);
        return `${percentage}%`;
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-1">Sales Dashboard</h2>
                <p className="text-blue-100 text-sm">Comprehensive overview of your business performance</p>
            </div>
            
            <div className="p-4 md:p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <SummaryCard 
                        title="Total Sales" 
                        value={total_sales.toLocaleString()} 
                        iconType="shopping-bag"
                        color="blue"
                        subtext="Units sold" 
                    />
                    <SummaryCard 
                        title="Revenue" 
                        value={`$${total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
                        iconType="trending-up"
                        color="green" 
                        subtext="Gross income"
                    />
                    <SummaryCard 
                        title="Categories" 
                        value={categories.length} 
                        iconType="folder"
                        color="purple"
                        subtext="Product groups" 
                    />
                    <SummaryCard 
                        title="Users" 
                        value={users.length} 
                        iconType="users"
                        color="orange"
                        subtext="Active users" 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Best Selling Product */}
                    {bestSellingProduct && (
                        <div className="lg:col-span-1">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                </svg>
                                Top Performer
                            </h3>
                            <div className="bg-yellow-50 p-5 rounded-lg shadow-sm border border-yellow-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{bestSellingProduct.name}</h4>
                                        <p className="text-gray-500 text-sm">{bestSellingProduct.category_name || 'Uncategorized'}</p>
                                    </div>
                                    <div className="bg-yellow-400 text-white p-2 rounded-lg">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                        </svg>
                                    </div>
                                </div>
                                
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">Sales</span>
                                            <span className="font-bold">{bestSellingProduct.total_sales.toLocaleString()} units</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className="bg-yellow-400 h-2 rounded-full transition-all duration-500" 
                                                style={{ width: getPercentage(bestSellingProduct.total_sales, total_sales) }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">Revenue</span>
                                            <span className="font-bold">${bestSellingProduct.total_revenue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className="bg-green-400 h-2 rounded-full transition-all duration-500" 
                                                style={{ width: getPercentage(bestSellingProduct.total_revenue, total_revenue) }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Currency Breakdown */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                            </svg>
                            Revenue by Currency
                        </h3>
                        <div className="bg-purple-50 p-5 rounded-lg shadow-sm border border-purple-100">
                            {revenue_by_currency.length > 0 ? (
                                <div className="space-y-3">
                                    {revenue_by_currency.map((item, index) => {
                                        const percentage = (parseFloat(item.total_revenue) / total_revenue) * 100;
                                        return (
                                            <div key={index}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-medium text-gray-700">{item.currency}</span>
                                                    <span className="font-bold text-gray-800">
                                                        ${parseFloat(item.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                                    <div 
                                                        className="bg-purple-500 h-2.5 rounded-full transition-all duration-500" 
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-right text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                                    <span className="font-medium">USD</span>
                                    <span className="font-bold text-xl">${parseFloat(total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Category Breakdown with Visual Bars */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                        Products by Category
                    </h3>
                    <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100">
                        {/* Simple bar chart visualization */}
                        <div className="space-y-3 mb-5">
                            {categoryProductCounts.map((category, index) => {
                                const maxCount = Math.max(...categoryProductCounts.map(c => c.count));
                                const percentage = (category.count / maxCount) * 100;
                                return (
                                    <div key={index}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-gray-700">{category.name}</span>
                                            <span className="font-bold text-gray-800">{category.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
                                            <div 
                                                className="bg-blue-500 rounded-full h-5 flex items-center transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            >
                                                {percentage > 25 && (
                                                    <span className="text-white text-xs font-medium ml-2">
                                                        {category.count} products
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-5">
                            {categoryProductCounts.map((category, index) => (
                                <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                                    <p className="text-gray-600 font-medium">{category.name}</p>
                                    <p className="text-xl font-bold text-gray-800">{category.count}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2 overflow-hidden">
                                        <div 
                                            className="bg-blue-500 h-1 rounded-full transition-all duration-500" 
                                            style={{ width: getPercentage(category.count, Math.max(...categoryProductCounts.map(c => c.count))) }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* User Role Breakdown */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        Users by Role
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(userRoleCounts).map(([role, count], index) => {
                            const colors = {
                                admin: 'bg-red-500',
                                cashier: 'bg-green-500',
                                owner: 'bg-blue-500'
                            };
                            
                            // Get appropriate icon based on role
                            let roleIcon;
                            if (role === 'admin') {
                                roleIcon = (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                );
                            } else if (role === 'cashier') {
                                roleIcon = (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                );
                            } else {
                                roleIcon = (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                                    </svg>
                                );
                            }
                            
                            return (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center mb-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${colors[role] || 'bg-gray-500'}`}>
                                            {roleIcon}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-gray-800 font-semibold">{role.charAt(0).toUpperCase() + role.slice(1)}</p>
                                            <p className="text-gray-500 text-xs">User role</p>
                                        </div>
                                    </div>
                                    <div className="flex items-end">
                                        <span className="text-2xl font-bold">{count}</span>
                                        <span className="text-gray-500 ml-2 mb-0.5 text-sm">users</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3 overflow-hidden">
                                        <div 
                                            className={`${colors[role] || 'bg-gray-500'} h-1.5 rounded-full transition-all duration-500`} 
                                            style={{ width: getPercentage(count, users.length) }}
                                        ></div>
                                    </div>
                                    <p className="text-right text-xs text-gray-500 mt-1">{((count / users.length) * 100).toFixed(1)}% of total</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Enhanced Summary card component with custom SVG icons
const SummaryCard = ({ title, value, iconType, color, subtext }) => {
    const cardColors = {
        blue: { bg: 'bg-blue-500', shadow: 'shadow-blue-100' },
        green: { bg: 'bg-green-500', shadow: 'shadow-green-100' },
        purple: { bg: 'bg-purple-500', shadow: 'shadow-purple-100' },
        orange: { bg: 'bg-orange-500', shadow: 'shadow-orange-100' }
    };
    
    const selectedColor = cardColors[color] || { bg: 'bg-gray-500', shadow: 'shadow-gray-100' };
    
    // Select appropriate icon based on type
    let icon;
    switch (iconType) {
        case 'shopping-bag':
            icon = (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
            );
            break;
        case 'trending-up':
            icon = (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
            );
            break;
        case 'folder':
            icon = (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                </svg>
            );
            break;
        case 'users':
            icon = (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
            );
            break;
        default:
            icon = (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
            );
    }
    
    return (
        <div className={`${selectedColor.bg} rounded-lg p-4 text-white shadow-md hover:shadow-lg transition-all duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-sm opacity-90">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    {subtext && <p className="text-xs opacity-80 mt-1">{subtext}</p>}
                </div>
                <div className="bg-white bg-opacity-25 p-2 rounded-lg">
                    {icon}
                </div>
            </div>
        </div>
    );
};

SaleSummary.propTypes = {
    reportData: PropTypes.shape({
        total_sales: PropTypes.number,
        total_revenue: PropTypes.number,
        revenue_by_currency: PropTypes.array,
    }),
    products: PropTypes.array,
    categories: PropTypes.array,
    users: PropTypes.array,
};

export default SaleSummary;