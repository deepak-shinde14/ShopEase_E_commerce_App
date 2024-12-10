//ProductList.js
import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ userId, products, purchaseHistory }) => {
  // Filter purchased product categories for the current user
  const userPurchases = purchaseHistory.filter(p => p.UserID === userId);
  const purchasedProductIDs = userPurchases.map(p => p.ProductID);
  const purchasedCategories = [...new Set(products
    .filter(p => purchasedProductIDs.includes(p.ProductID))
    .map(p => p.Category))];

  // Separate products into purchased and non-purchased categories
  const nonPurchasedProducts = products
    .filter(p => !purchasedCategories.includes(p.Category))
    .sort((a, b) => a.ProductName.localeCompare(b.ProductName));

  const purchasedProducts = products
    .filter(p => purchasedCategories.includes(p.Category))
    .sort((a, b) => a.ProductName.localeCompare(b.ProductName));

  const sortedProducts = [...nonPurchasedProducts, ...purchasedProducts];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {sortedProducts.map(product => (
        <ProductCard key={product.ProductID} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
