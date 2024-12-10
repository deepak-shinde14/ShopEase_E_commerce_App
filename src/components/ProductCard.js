//ProductCard.js
import React, { useState } from 'react';

const ProductCard = ({ product, onAddToWishlist }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleWishlist = () => {
    onAddToWishlist(product);
    setIsInWishlist(!isInWishlist);
  };

  return (
    <div className="border rounded p-4 shadow-lg">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button
        onClick={handleWishlist}
        className={`mt-2 px-4 py-2 rounded ${
          isInWishlist ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}
      >
        {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </button>
    </div>
  );
};


export default ProductCard;
