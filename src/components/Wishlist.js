//Wishlist.js
import React from 'react';
import ProductCard from './ProductCard';

const Wishlist = ({ wishlist }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold my-4">Your Wishlist</h2>
      <div className="flex flex-wrap">
        {wishlist.map((product) => (
          <ProductCard key={product.ProductID} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
