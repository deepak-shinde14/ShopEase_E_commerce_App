import React, { useState, useEffect } from 'react';
import { loadPurchaseHistory, loadProducts } from '../utils/dataLoader';

const OrderPage = ({ loggedInUser }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const purchaseHistory = await loadPurchaseHistory();
        const products = await loadProducts();

        const userOrders = purchaseHistory
          .filter((entry) => entry.userId === loggedInUser?.userId)
          .map((entry) => {
            const product = products.find((p) => p.id === entry.productId);
            return {
              ...product,
              purchaseDate: entry.purchaseDate,
            };
          });

        setOrders(userOrders);
      } catch (err) {
        setError('Failed to load orders.');
      }
    };

    if (loggedInUser) {
      fetchOrders();
    }
  }, [loggedInUser]);

  if (!loggedInUser) {
    return <div>Please log in to view your orders.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div>You have no orders.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order, index) => (
            <div key={index} className="border rounded shadow p-4">
              <img
                src={order.image || 'https://via.placeholder.com/150'}
                alt={order.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-bold">{order.name}</h3>
              <p>{order.category}</p>
              <p>${order.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">
                Purchased on: {new Date(order.purchaseDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
