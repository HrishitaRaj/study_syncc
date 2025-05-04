import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaClock, 
  FaListUl, 
  FaCalendarAlt,
  FaBook,
  FaUsers,
  FaBell
} from 'react-icons/fa';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const statVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(37, 99, 235, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const recentActivities = [
    { name: "Uploaded Study Notes", time: "2 hours ago", type: "resource" },
    { name: "Completed Pomodoro Session", time: "Yesterday", type: "pomodoro" },
    { name: "Joined Physics Study Group", time: "2 days ago", type: "group" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50">
      <Navbar />
      
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Welcome Card */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-white mb-1">
                Welcome back, {user.name}!
              </h1>
              <p className="text-blue-100">
                You're logged in as a <span className="font-semibold text-white">{user.role}</span>
              </p>
            </motion.div>
          </div>

          <div className="p-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-blue-50 rounded-xl p-4 flex items-center"
                whileHover={statVariants.hover}
              >
                <div className="bg-blue-500 text-white p-3 rounded-lg mr-4">
                  <FaBook className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-blue-600">Resources</p>
                  <p className="text-xl font-bold text-gray-800">25</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-indigo-50 rounded-xl p-4 flex items-center"
                whileHover={statVariants.hover}
              >
                <div className="bg-indigo-500 text-white p-3 rounded-lg mr-4">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-indigo-600">Study Hours</p>
                  <p className="text-xl font-bold text-gray-800">12.5</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-purple-50 rounded-xl p-4 flex items-center"
                whileHover={statVariants.hover}
              >
                <div className="bg-purple-500 text-white p-3 rounded-lg mr-4">
                  <FaUsers className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-purple-600">Study Groups</p>
                  <p className="text-xl font-bold text-gray-800">4</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tools Section */}
          <motion.div 
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"
              variants={itemVariants}
            >
              <span className="text-blue-600">
                {user.role === 'student' ? <FaUserGraduate /> : <FaChalkboardTeacher />}
              </span> 
              Your Study Tools
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                variants={itemVariants}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaClock className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 ml-3">Pomodoro Timer</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">Focus on your studies with timed intervals and structured breaks.</p>
                <motion.button 
                  className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Session
                </motion.button>
              </motion.div>

              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                variants={itemVariants}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <FaListUl className="text-indigo-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 ml-3">To-Do List</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">Organize your tasks and track your progress efficiently.</p>
                <motion.button 
                  className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Tasks
                </motion.button>
              </motion.div>

              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                variants={itemVariants}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaCalendarAlt className="text-purple-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 ml-3">Study Plan</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">Personalized study schedules tailored to your goals.</p>
                <motion.button 
                  className="w-full py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Plan
                </motion.button>
              </motion.div>

              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-violet-500"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                variants={itemVariants}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-violet-100 p-3 rounded-lg">
                    <FaUsers className="text-violet-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 ml-3">Study Groups</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">Collaborate with peers on projects and assignments.</p>
                <motion.button 
                  className="w-full py-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join Groups
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* User Profile & Recent Activities */}
          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Profile Card */}
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              variants={itemVariants}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">Account Info</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </motion.div>
                </div>
                <div className="space-y-3 text-center">
                  <h4 className="text-lg font-semibold text-gray-800">{user.name}</h4>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  <div className="bg-blue-50 text-blue-700 font-medium py-1 px-3 rounded-full text-xs inline-block">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>
                <div className="mt-6">
                  <motion.button 
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Edit Profile
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              variants={itemVariants}
            >
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FaBell /> Recent Activities
                </h3>
              </div>
              <div className="p-4">
                {recentActivities.map((activity, index) => (
                  <motion.div 
                    key={index}
                    className="py-3 px-2 border-b border-gray-100 last:border-0"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <div className="flex items-start">
                      <div className={`
                        p-2 rounded-lg mr-3 mt-1
                        ${activity.type === 'resource' ? 'bg-blue-100 text-blue-600' : 
                          activity.type === 'pomodoro' ? 'bg-green-100 text-green-600' : 
                          'bg-purple-100 text-purple-600'}
                      `}>
                        {activity.type === 'resource' ? <FaBook size={14} /> : 
                         activity.type === 'pomodoro' ? <FaClock size={14} /> : 
                         <FaUsers size={14} />}
                      </div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">{activity.name}</p>
                        <p className="text-gray-500 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
export default Dashboard;