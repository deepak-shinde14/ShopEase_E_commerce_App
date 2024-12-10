import React, { useState, useEffect } from 'react';
import { loadProducts } from '../utils/dataLoader';
import purchaseHistory from '../data/purchase_history.csv'; // Assuming you can import the CSV data

const ShoppingPage = ({ loggedInUser }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState(
    JSON.parse(localStorage.getItem(`recentlyViewed_${loggedInUser?.userId}`)) || []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const [filters, setFilters] = useState({
    size: '',
    brand: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    material: '',
    color: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      const allProducts = await loadProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);

      // Filter flash sale products (e.g., those under a certain price)
      const flashSale = allProducts.filter(product => product.price < 3000); // Example condition
      setFlashSaleProducts(flashSale);

      // Check purchase history for the logged-in user and filter recommendations
      if (loggedInUser) {
        // Assuming purchaseHistory is an array of objects that includes userID and productID
        const userPurchaseHistory = purchaseHistory.filter(entry => entry.UserID === loggedInUser.userId);
        const purchasedProductIds = userPurchaseHistory.map(entry => entry.ProductID);

        // Get products that the user has already purchased
        const purchasedProducts = allProducts.filter(product =>
          purchasedProductIds.includes(product.id)
        );
        setRecommendedProducts(purchasedProducts);

        // Optionally: Recommend complementary products based on categories or similar attributes
        const complementaryProducts = allProducts.filter(product => {
          return purchasedProducts.some(purchasedProduct => purchasedProduct.category === product.category);
        });
        setRecommendedProducts([...recommendedProducts, ...complementaryProducts]);
      }
    };

    fetchData();
  }, [loggedInUser]);

  useEffect(() => {
    let filtered = products;

    // Apply filters
    if (filters.size) filtered = filtered.filter(product => product.size === filters.size);
    if (filters.brand) filtered = filtered.filter(product => product.brand === filters.brand);
    if (filters.category) filtered = filtered.filter(product => product.category === filters.category);
    if (filters.minPrice) filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
    if (filters.maxPrice) filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
    if (filters.material) filtered = filtered.filter(product => product.material === filters.material);
    if (filters.color) filtered = filtered.filter(product => product.color === filters.color);

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [filters, products, searchQuery]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const filteredSuggestions = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSearchSuggestions(filteredSuggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setSearchSuggestions([]);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchSuggestions([]);
    setFilteredProducts(products);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = page => setCurrentPage(page);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleProductClick = product => {
    if (loggedInUser) {
      const updatedRecentlyViewed = [product, ...recentlyViewed.filter(item => item.id !== product.id)];
      setRecentlyViewed(updatedRecentlyViewed);
      localStorage.setItem(`recentlyViewed_${loggedInUser.userId}`, JSON.stringify(updatedRecentlyViewed));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Shop Products</h2>

      {/* Search Bar */}
      <div className="mb-6 flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="p-2 border rounded w-1/2"
        />
        {searchQuery && (
          <button onClick={handleClearSearch} className="ml-2 text-gray-500">Clear</button>
        )}
      </div>

      {/* Search Suggestions */}
      {searchSuggestions.length > 0 && (
        <div className="mb-6">
          <ul className="bg-white shadow-lg border rounded-md">
            {searchSuggestions.map((product) => (
              <li key={product.id} className="p-2 cursor-pointer hover:bg-gray-200" onClick={() => handleSuggestionClick(product)}>
                {product.name} ({product.category})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Flash Sale Notification */}
      {flashSaleProducts.length > 0 && (
        <div className="mb-6 bg-red-500 text-white p-4 rounded">
          <h3 className="text-lg font-bold">Flash Sale! Limited Time Offer!</h3>
          <p>Hurry up! Check out products on flash sale with amazing discounts!</p>
        </div>
      )}

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">Recommended for You</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedProducts.map(product => (
              <div key={product.id} className="bg-white p-4 rounded shadow hover:shadow-lg">
                <img
                  src={product.image || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-4"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500">{product.category}</p>
                <p className="text-blue-500 font-bold">₹{product.price.toFixed(2)}</p>
                <button
                  onClick={() => handleProductClick(product)}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  View Product
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtering Section */}
      {/* Same as previous, with filters for size, brand, etc. */}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map(product => (
          <div key={product.id} className="bg-white p-4 rounded shadow hover:shadow-lg">
            <img
              src={product.image || 'https://via.placeholder.com/150'}
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-500">{product.category}</p>
            <p className="text-blue-500 font-bold">₹{product.price.toFixed(2)}</p>
            <button
              onClick={() => handleProductClick(product)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              View Product
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="mx-4">{currentPage} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ShoppingPage;
