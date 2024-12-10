import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadUsers } from '../utils/dataLoader'; // Import the async loader
import { useUser } from '../context/UserContext';  // Import the useUser hook

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]); // Local state for users
  const { setLoggedInUser } = useUser();  // Access setLoggedInUser from context
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const loadedUsers = await loadUsers();  // Await the async call to load users
        setUsers(loadedUsers);  // Set the users in state
      } catch (error) {
        console.error('Error loading users:', error);
        setError('Failed to load users');
      }
    };
    
    fetchUsers();  // Call the async function
  }, []);

  const handleLogin = () => {
    if (users.length === 0) {
      setError('Users are still loading. Please try again later.');
      return;
    }

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setLoggedInUser(user);  // Set user in context
      setError('');
      navigate('/shopping');  // Navigate to shopping page after login
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-4">Please log in to continue</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Login
        </button>
        <p className="text-center text-gray-500 text-sm mt-6">
          Need help? <a href="#" className="text-blue-500 hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
