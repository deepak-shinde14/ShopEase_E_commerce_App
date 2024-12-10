import React, { useState, useEffect } from 'react';
import { loadProducts } from '../utils/dataLoader'; // Mock data loader
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Assuming useUser is exported from UserContext

const WishlistPage = () => {
  const [products, setProducts] = useState([]); // All products
  const [wishlist, setWishlist] = useState([]); // User's wishlist
  const [priceAlerts, setPriceAlerts] = useState([]); // Price drop alerts
  const { loggedInUser, getUserWishlist, setUserWishlist } = useUser(); // Access user-specific methods from context

  useEffect(() => {
    // Fetch products when the component mounts
    const fetchProducts = async () => {
      const allProducts = await loadProducts();
      setProducts(allProducts);
    };

    fetchProducts();

    if (loggedInUser) {
      // Fetch the wishlist for the logged-in user
      const userWishlist = getUserWishlist();
      setWishlist(userWishlist);
    }
  }, [loggedInUser, getUserWishlist]);

  useEffect(() => {
    // Simulate periodic price updates and check for price drops
    const interval = setInterval(() => {
      const updatedProducts = products.map((product) => {
        // Simulate random price changes
        const randomChange = Math.random() > 0.7 ? -1 * Math.floor(Math.random() * 500) : 0;
        const newPrice = Math.max(product.price + randomChange, 1); // Prevent negative prices

        return { ...product, price: newPrice };
      });

      setProducts(updatedProducts);

      // Check for price drops in the wishlist
      const alerts = wishlist.reduce((acc, item) => {
        const updatedProduct = updatedProducts.find((p) => p.id === item.id);
        if (
          updatedProduct &&
          item.desiredPrice &&
          updatedProduct.price < item.desiredPrice
        ) {
          acc.push({
            id: updatedProduct.id,
            name: updatedProduct.name,
            desiredPrice: item.desiredPrice,
            newPrice: updatedProduct.price,
          });
        }
        return acc;
      }, []);

      setPriceAlerts(alerts);
    }, 5000); // Update every 5 seconds for simulation

    return () => clearInterval(interval); // Clean up the interval
  }, [products, wishlist]);

  const toggleWishlist = (product) => {
    if (!loggedInUser) {
      alert('You must log in to modify your wishlist.');
      return;
    }

    const updatedWishlist = wishlist.some((item) => item.id === product.id)
      ? wishlist.filter((item) => item.id !== product.id) // Remove from wishlist
      : [...wishlist, { ...product, desiredPrice: '' }]; // Add to wishlist with default desired price

    setWishlist(updatedWishlist);
    setUserWishlist(updatedWishlist); // Save to localStorage via context
  };

  const updateDesiredPrice = (id, price) => {
    if (isNaN(price)) return; // Prevent saving non-numeric values

    setWishlist((prevWishlist) =>
      prevWishlist.map((item) =>
        item.id === id ? { ...item, desiredPrice: price } : item
      )
    );

    // Save updated desired prices to localStorage
    const updatedDesiredPrices = wishlist.reduce((acc, item) => {
      acc[item.id] = item.desiredPrice;
      return acc;
    }, {});

    setUserWishlist(wishlist.map((item) => ({ ...item, desiredPrice: updatedDesiredPrices[item.id] })));
  };

  const dismissAlert = (id) => {
    setPriceAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Wishlist</h2>

      {/* Price Drop Alerts */}
      {priceAlerts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-red-500">Price Drop Alerts</h3>
          <ul>
            {priceAlerts.map((alert) => (
              <li
                key={alert.id}
                className="bg-yellow-100 p-4 rounded shadow mb-4 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>{alert.name}</strong> has dropped to{' '}
                    <span className="text-green-500">₹{alert.newPrice.toFixed(2)}</span>{' '}
                    (Desired Price: ₹{alert.desiredPrice.toFixed(2)})
                  </p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Dismiss
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Wishlist Items */}
      {wishlist.length === 0 ? (
        <div className="text-center text-gray-500">Your wishlist is empty. Add items to it from the shop.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded shadow hover:shadow-lg">
              <img
                src={product.image || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500">{product.category}</p>
              <p className="text-blue-500 font-bold">₹{product.price.toFixed(2)}</p>
              <div className="mt-4">
                <label htmlFor={`price-${product.id}`} className="block text-sm font-medium text-gray-700">
                  Desired Price
                </label>
                <input
                  type="number"
                  id={`price-${product.id}`}
                  value={product.desiredPrice || ''}
                  onChange={(e) => updateDesiredPrice(product.id, parseFloat(e.target.value))}
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Set desired price"
                />
              </div>
              <button
                onClick={() => toggleWishlist(product)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Browse Products */}
      <h3 className="text-xl font-bold mt-8 mb-4">Browse Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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
              onClick={() => toggleWishlist(product)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {wishlist.some((item) => item.id === product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link to="/shopping" className="text-blue-500 hover:underline">
          Go back to Shop
        </Link>
      </div>
    </div>
  );
};

export default WishlistPage;
