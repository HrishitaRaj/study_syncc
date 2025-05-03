import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) {
    // If user data isn't available (e.g., after page refresh), redirect to login
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user.name} 👋</h1>
          <p className="text-gray-600 mb-6">
            You are logged in as a{' '}
            <span className="font-semibold text-blue-600">{user.role}</span>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-blue-100 p-5 rounded-lg shadow-inner">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                {user.role === 'student' ? <FaUserGraduate /> : <FaChalkboardTeacher />} Your Tools
              </h2>
              <ul className="mt-3 text-gray-600 space-y-2 text-sm">
                <li>✅ Pomodoro Timer</li>
                <li>✅ To-Do List</li>
                <li>✅ Personalized Study Plan</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg shadow-inner">
              <h2 className="text-xl font-semibold text-gray-700">Account Info</h2>
              <ul className="mt-3 text-gray-600 text-sm space-y-1">
                <li><strong>Name:</strong> {user.name}</li>
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Role:</strong> {user.role}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
