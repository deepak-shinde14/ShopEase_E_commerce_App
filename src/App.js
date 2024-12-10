import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { User, Moon, Sun, MessageCircle } from 'lucide-react';
import { UserProvider, useUser } from './context/UserContext'; // Import UserContext
import LoginPage from './pages/LoginPage';
import ShoppingPage from './pages/ShoppingPage';
import WishlistPage from './pages/WishlistPage';
import UserDetailsModal from './components/UserDetailsModal';
import ChatBotComponent from './components/ChatBotComponent';

const App = () => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const { loggedInUser } = useUser();  // Use the user context

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const toggleChatBot = () => {
    setIsChatBotOpen((prev) => !prev);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="bg-primary text-white py-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              <Link to="/">ShopEase</Link>
            </h1>
            <nav className="flex items-center space-x-4">
              {loggedInUser && (
                <>
                  <Link to="/shopping" className="hover:underline">Shop</Link>
                  <Link to="/wishlist" className="hover:underline">Wishlist</Link>
                  <button onClick={toggleDarkMode} className="bg-transparent p-2 rounded-full">
                    {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                  </button>
                  <button
                    onClick={() => setShowUserDetails(true)}
                    className="bg-transparent hover:bg-white/20 p-2 rounded-full"
                  >
                    <User size={24} />
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-grow bg-secondary py-8">
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/shopping" element={<ShoppingPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Routes>
          </div>
        </main>

        {showUserDetails && loggedInUser && (
          <UserDetailsModal
            user={loggedInUser}
            onClose={() => setShowUserDetails(false)}
          />
        )}

        <ChatBotComponent isOpen={isChatBotOpen} onClose={toggleChatBot} />

        {loggedInUser && (
          <button
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
            onClick={toggleChatBot}
          >
            <MessageCircle size={24} />
          </button>
        )}

        <footer className="bg-dark text-white py-4">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 ShopEase. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

const WrappedApp = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

export default WrappedApp;
