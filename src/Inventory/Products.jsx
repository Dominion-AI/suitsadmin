import React, { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "../Services/api";
import ProductDetails from "./ProductDetails";
import StockMovement from "./StockMovement";
import { Search, Package, RefreshCw, Trash2, Filter, Edit, Eye, ChevronDown, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const ProductInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [stockFilter, setStockFilter] = useState("all");
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(product => 
        product.category_name || "Uncategorized"
      ))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("Error loading products. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteProduct(id);
        fetchProducts();
        showNotification(`${name} was successfully deleted`, "success");
      } catch (error) {
        console.error("Error deleting product:", error);
        showNotification("Failed to delete product. Please try again.", "error");
      }
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const toggleProductDetails = (id) => {
    setExpandedProductId(expandedProductId === id ? null : id);
  };

  const handleProductAdded = () => {
    fetchProducts();
    setIsAddingProduct(false);
    showNotification("Product successfully added!", "success");
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = searchTerm === "" || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || 
        (product.category_name || "Uncategorized") === selectedCategory;
      
      let matchesStock = true;
      if (stockFilter === "low") {
        matchesStock = product.quantity_in_stock <= 5;
      } else if (stockFilter === "medium") {
        matchesStock = product.quantity_in_stock > 5 && product.quantity_in_stock <= 20;
      } else if (stockFilter === "high") {
        matchesStock = product.quantity_in_stock > 20;
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "price" || sortBy === "quantity_in_stock") {
        aValue = parseFloat(a[sortBy]) || 0;
        bValue = parseFloat(b[sortBy]) || 0;
      } else {
        aValue = (aValue || "").toString().toLowerCase();
        bValue = (bValue || "").toString().toLowerCase();
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStockLevelClass = (quantity) => {
    if (quantity <= 5) return "bg-red-100 text-red-800 border-red-200";
    if (quantity <= 20) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getStockLevelIcon = (quantity) => {
    if (quantity <= 5) return <AlertCircle className="h-4 w-4" />;
    if (quantity <= 20) return <CheckCircle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setStockFilter("all");
    setSortBy("name");
    setSortOrder("asc");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {notification && (
        <div 
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md transition-all duration-300 animate-slideIn ${
            notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" :
            notification.type === "error" ? "bg-red-50 text-red-800 border border-red-200" :
            "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : notification.type === "error" ? (
            <XCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p>{notification.message}</p>
          <button 
            onClick={() => setNotification(null)}
            className="ml-auto text-gray-500 hover:text-gray-700"
            aria-label="Dismiss notification"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-indigo-800 flex items-center gap-2">
              <Package className="h-8 w-8" /> Product Inventory
            </h2>
            <p className="text-gray-600 mt-1">Manage and organize your product catalog</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className={`px-4 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 ${
                isAddingProduct 
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {isAddingProduct ? (
                <>
                  <XCircle className="h-4 w-4" /> Cancel
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </>
              )}
            </button>
          </div>
        </header>

        {isAddingProduct && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-indigo-500 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Product</h3>
            <ProductDetails onProductAdded={handleProductAdded} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0 flex items-center gap-2">
              <Package className="h-5 w-5 text-indigo-600" /> 
              Product List
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                {filteredProducts.length} items
              </span>
            </h3>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 pl-10 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-colors"
                  aria-label="Search products"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${showFilters ? 'bg-gray-100' : ''}`}
                aria-label="Toggle filters"
              >
                <Filter className="h-5 w-5" />
              </button>
              
              <button 
                onClick={fetchProducts} 
                className="p-2 text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors"
                aria-label="Refresh product list"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200 animate-fadeIn">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/4">
                  <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="w-full md:w-1/4">
                  <label htmlFor="stock-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Level
                  </label>
                  <select
                    id="stock-filter"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  >
                    <option value="all">All Levels</option>
                    <option value="low">Low Stock (≤ 5)</option>
                    <option value="medium">Medium Stock (6-20)</option>
                    <option value="high">High Stock (&gt;20)</option>
                  </select>
                </div>
                
                <div className="w-full md:w-1/4">
                  <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  >
                    <option value="name">Name</option>
                    <option value="category_name">Category</option>
                    <option value="price">Price</option>
                    <option value="quantity_in_stock">Stock Level</option>
                  </select>
                </div>
                
                <div className="w-full md:w-1/4">
                  <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-gray-500">Loading products...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h4 className="text-xl font-medium text-gray-700 mb-2">No products found</h4>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any products that match your current filters or search criteria.</p>
              <button 
                onClick={resetFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort("name")}>
                      <div className="flex items-center">
                        Product Name
                        {sortBy === "name" && (
                          <span className="ml-1 text-indigo-600">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort("category_name")}>
                      <div className="flex items-center">
                        Category
                        {sortBy === "category_name" && (
                          <span className="ml-1 text-indigo-600">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort("price")}>
                      <div className="flex items-center">
                        Price
                        {sortBy === "price" && (
                          <span className="ml-1 text-indigo-600">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleSort("quantity_in_stock")}>
                      <div className="flex items-center">
                        Stock
                        {sortBy === "quantity_in_stock" && (
                          <span className="ml-1 text-indigo-600">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <>
                      <tr 
                        key={product.id} 
                        className={`hover:bg-gray-50 transition-colors ${expandedProductId === product.id ? 'bg-indigo-50' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => toggleProductDetails(product.id)}
                            className="flex items-start w-full text-left group"
                          >
                            <div className="mr-2 mt-1 text-indigo-500 transform transition-transform group-hover:rotate-90">
                              <ChevronDown className={`h-4 w-4 transition-transform ${expandedProductId === product.id ? 'rotate-180' : ''}`} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-xs text-gray-500 max-w-xs truncate">{product.description}</div>
                            </div>
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {product.category_name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="font-medium">${parseFloat(product.price).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStockLevelClass(product.quantity_in_stock)} flex items-center gap-1`}>
                            {getStockLevelIcon(product.quantity_in_stock)}
                            {product.quantity_in_stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center gap-2">
                            <button 
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                              aria-label={`View ${product.name} details`}
                              onClick={() => toggleProductDetails(product.id)}
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <StockMovement 
                              productId={product.id} 
                              productName={product.name}
                              currentStock={product.quantity_in_stock}
                              onStockUpdated={() => {
                                fetchProducts();
                                showNotification(`Stock updated for ${product.name}`, "success");
                              }} 
                            />
                            <button
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                              aria-label={`Edit ${product.name}`}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedProductId === product.id && (
                        <tr className="bg-indigo-50 animate-fadeIn">
                          <td colSpan={5} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Product Details</h4>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">ID:</span> {product.id}</p>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">SKU:</span> {product.sku || 'N/A'}</p>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Created:</span> {new Date().toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600"><span className="font-medium">Last Updated:</span> {new Date().toLocaleDateString()}</p>
                              </div>
                              
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                                <p className="text-sm text-gray-600">{product.description || 'No description available.'}</p>
                              </div>
                              
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Inventory</h4>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-600">Current Stock:</span>
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStockLevelClass(product.quantity_in_stock)}`}>
                                    {product.quantity_in_stock} units
                                  </span>
                                </div>
                                <div className="mt-3">
                                  <StockMovement 
                                    productId={product.id} 
                                    productName={product.name}
                                    currentStock={product.quantity_in_stock}
                                    onStockUpdated={() => {
                                      fetchProducts();
                                      showNotification(`Stock updated for ${product.name}`, "success");
                                    }}
                                    expanded={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div>
              Showing {filteredProducts.length} of {products.length} products
            </div>
            <div className="mt-2 md:mt-0">
              {stockFilter === "low" && filteredProducts.some(p => p.quantity_in_stock <= 5) && (
                <div className="flex items-center text-red-700 bg-red-50 px-3 py-1 rounded">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{filteredProducts.filter(p => p.quantity_in_stock <= 5).length} products with low stock</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInventory;