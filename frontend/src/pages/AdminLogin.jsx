import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5555/admin/login', {
        username: username,
        password: password,
        role: role // Include role in the login request
      });

      // Store jwt token values
      localStorage.setItem('token', response.data.token);
      
      // Navigate based on the selected role
      if (role === 'user') {
        navigate('/user');
      } else if (role === 'hospitalAdmin') {
        navigate('/home');
      } else if (role === 'admin') {
        navigate('/admin');
      }
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>} {/* Show error message */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Login As</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="user">User</option>
              <option value="hospitalAdmin">Hospital Admin</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
