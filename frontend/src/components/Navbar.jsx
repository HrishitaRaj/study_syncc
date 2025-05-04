import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBookOpen, FaSignOutAlt, FaBook, FaCheck, FaClock, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <Link
  to={localStorage.getItem('token') ? "/dashboard" : "/login"}
  className="flex items-center gap-2 text-blue-600 font-bold text-xl"
>
  <FaBookOpen className="text-2xl" />
  StudySync
</Link>

        <div className="flex items-center gap-4 text-gray-600">
          <Link to="/todo" className="hover:text-blue-500 transition flex items-center">
            <FaCheck className="mr-1" /> To-Do
          </Link>
          <Link to="/pomodoro" className="hover:text-blue-500 transition flex items-center">
            <FaClock className="mr-1" /> Pomodoro
          </Link>
          <Link to="/studygroups" className="hover:text-blue-500 transition flex items-center">
            <FaUser className="mr-1" />StudyGroups
          </Link>
          <Link to="/resources" className="hover:text-blue-500 transition flex items-center">
            <FaBook className="mr-1" /> Resources
          </Link>
          <Link to="/studygroups" className="hover:text-blue-500 transition">Study Groups</Link>
          <Link to="/quiz" className="hover:text-blue-500 transition">QuizMe</Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
