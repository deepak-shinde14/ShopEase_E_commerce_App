//dataloader.js
import Papa from 'papaparse';
import usersCsv from '../data/users.csv';
import productsCsv from '../data/products.csv';
import purchaseHistoryCsv from '../data/purchase_history.csv';

const safeTrim = (value) => (value ? value.trim() : '');

export const loadUsers = () => {
  return new Promise((resolve, reject) => {
    let users = [];
    Papa.parse(usersCsv, {
      download: true,
      header: true,
      complete: (result) => {
        users = result.data.map((user) => ({
          userId: safeTrim(user.UserID),
          username: safeTrim(user.Username),
          password: safeTrim(user.Password),
        }));
        resolve(users);
      },
      error: (err) => reject(err),
    });
  });
};

export const loadProducts = () => {
  return new Promise((resolve, reject) => {
    let products = [];
    Papa.parse(productsCsv, {
      download: true,
      header: true,
      complete: (result) => {
        products = result.data.map((product) => ({
          id: safeTrim(product.ProductID),
          name: safeTrim(product.ProductName),
          category: safeTrim(product.Category),
          price: parseFloat(product.Price) || 0,
          image: safeTrim(product.ImageURL),
        }));
        resolve(products);
      },
      error: (err) => reject(err),
    });
  });
};

export const loadPurchaseHistory = () => {
  return new Promise((resolve, reject) => {
    let purchaseHistory = [];
    Papa.parse(purchaseHistoryCsv, {
      download: true,
      header: true,
      complete: (result) => {
        purchaseHistory = result.data.map((entry) => ({
          userId: safeTrim(entry.UserID),
          productId: safeTrim(entry.ProductID),
        }));
        resolve(purchaseHistory);
      },
      error: (err) => reject(err),
    });
  });
};
