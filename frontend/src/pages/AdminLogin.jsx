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
      let response;
      
      // Use different endpoints based on role
      if (role === 'user') {
        response = await axios.post('http://localhost:5555/patient/login', {
          username: username,
          password: password
        });
      } else if (role === 'admin') {
        // For admin roles
        response = await axios.post('http://localhost:5555/admin/login', {
          username: username,
          password: password,
          role: role
        });
      } else if (role === 'hospital') {
        // For hospital admin roles - note: using email instead of username
        response = await axios.post('http://localhost:5555/hospitaldashboard/login', {
          email: username, // Using username field for email input
          password: password
        });
      }

      // Store jwt token values
      localStorage.setItem('token', response.data.token);
      
      // Store user information for future reference
      if (response.data.user) {
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      }
      
      // Navigate based on the selected role
      if (role === 'user') {
        if (response.data.user && response.data.user._id) {
          navigate(`/patient/view/${response.data.user._id}`); // Navigate to the specific patient profile page
        } else {
          navigate('/user'); // Fallback to generic user route if no ID found
        }
      } else if (role === 'hospital') {
        // Store the complete user object
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Create URL-friendly hospital name by replacing spaces with dashes and removing special characters
        const hospitalNameForUrl = response.data.user.hospitalName
          ? response.data.user.hospitalName
              .toLowerCase()
              .replace(/[^\w\s-]/g, '') // Remove special characters
              .replace(/\s+/g, '-')     // Replace spaces with dashes
          : 'dashboard';
        
        // Navigate to hospital dashboard with hospital name in URL
        navigate(`/hospitaldashboard/${hospitalNameForUrl}`);
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      }
     
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              {role === 'hospital' ? 'Email' : 'Username'}
            </label>
            <input
              type={role === 'hospital' ? 'email' : 'text'}
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
              <option value="hospital">Hospital Admin</option>
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
