import React from 'react';
import { X } from 'lucide-react';
import { useUser } from '../context/UserContext'; // Import the User Context
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UserDetailsModal = ({ user, onClose }) => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear user data
    onClose(); // Close the modal
    navigate('/'); // Redirect to the LoginPage
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>
        <div className="text-center">
          <div className="bg-primary text-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">{user.username[0].toUpperCase()}</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
          <div className="text-gray-600 space-y-2">
            <p><strong>User ID:</strong> {user.userId}</p>
            <p><strong>Account Type:</strong> Regular User</p>
            <p><strong>Member Since:</strong> {new Date().getFullYear()}</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
