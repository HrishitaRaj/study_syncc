import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // 👈 if you're using react-router-dom

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-white px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Create an Account</h2>
        <p className="text-center text-gray-500 text-sm">Join StudySync today</p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
          onChange={handleChange}
          required
        />
        <select
          name="role"
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
        >
          Register
        </button>

        <Link
          to="/login"
          className="block w-full text-center border border-blue-500 text-blue-600 font-semibold py-2 rounded-lg transition duration-200 hover:bg-blue-50"
        >
          Already have an account? Login
        </Link>

        {message && (
          <p
            className={`text-center text-sm mt-2 ${
              message.includes('successfully') ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 StudySync. All rights reserved.
        </p>
      </motion.form>
    </div>
  );
};

export default Register;
