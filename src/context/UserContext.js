import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);
  
    const setUserWishlist = (wishlist) => {
      if (loggedInUser) {
        localStorage.setItem(`wishlist-${loggedInUser.userId}`, JSON.stringify(wishlist));
      }
    };
  
    const getUserWishlist = () => {
      if (loggedInUser) {
        return JSON.parse(localStorage.getItem(`wishlist-${loggedInUser.userId}`)) || [];
      }
      return [];
    };
  
    const logout = () => {
      setLoggedInUser(null);
      localStorage.removeItem('loggedInUser');
    };
  
    return (
      <UserContext.Provider
        value={{ loggedInUser, setLoggedInUser, logout, setUserWishlist, getUserWishlist }}
      >
        {children}
      </UserContext.Provider>
    );
  };