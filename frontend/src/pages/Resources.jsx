import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaLink, FaBook, FaVideo, FaFile, FaFilter, FaSearch } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    resource_url: '',
    resource_type: 'link'
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const formVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: "auto", 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    },
    exit: { 
      height: 0, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/resources');
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create resource');
      }
      
      const newResource = await response.json();
      setResources([newResource, ...resources]);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        subject: '',
        resource_url: '',
        resource_type: 'link'
      });
    } catch (error) {
      console.error('Error creating resource:', error);
    }
  };

  const deleteResource = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }
      
      setResources(resources.filter(resource => resource.id !== id));
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const getResourceIcon = (type) => {
    switch(type) {
      case 'video': return <FaVideo className="text-red-500" />;
      case 'document': return <FaFile className="text-blue-500" />;
      case 'book': return <FaBook className="text-green-500" />;
      default: return <FaLink className="text-purple-500" />;
    }
  };

  const filteredResources = resources
    .filter(resource => 
      (filter === 'all' || resource.resource_type === filter) &&
      (resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       resource.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <>
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto p-4 pt-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Study Resources
          </motion.h1>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all mt-4 md:mt-0"
          >
            {showForm ? 'Cancel' : <><FaPlus /> Add Resource</>}
          </motion.button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div 
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl shadow-xl p-6 mb-8 overflow-hidden border border-gray-100"
            >
              <h2 className="text-xl font-semibold mb-5 text-gray-800">Add New Resource</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resource URL
                    </label>
                    <input
                      type="url"
                      name="resource_url"
                      value={formData.resource_url}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="https://"
                    />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-4"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resource Type
                    </label>
                    <select
                      name="resource_type"
                      value={formData.resource_type}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="link">Link</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                      <option value="book">Book</option>
                    </select>
                  </motion.div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-5"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  ></textarea>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    Add Resource
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">All Types</option>
              <option value="link">Links</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
              <option value="book">Books</option>
            </select>
          </div>
        </motion.div>

        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"
            ></motion.div>
            <p className="mt-4 text-gray-600">Loading resources...</p>
          </motion.div>
        ) : filteredResources.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 rounded-2xl p-12 text-center shadow-inner"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <FaBook className="text-gray-400 text-6xl mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-medium text-gray-700 mb-3">No resources found</h3>
            <p className="text-gray-500">
              {resources.length === 0 
                ? "Click the \"Add Resource\" button to add your first study resource."
                : "Try adjusting your search or filter criteria."}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredResources.map((resource) => (
                <motion.div
                  layout
                  key={resource.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all"
                >
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border-b">
                    <div className="flex items-center">
                      <motion.div 
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="p-3 rounded-full bg-gray-100 mr-3 shadow-sm"
                      >
                        {getResourceIcon(resource.resource_type)}
                      </motion.div>
                      <div>
                        <h3 className="font-medium text-gray-800">{resource.title}</h3>
                        {resource.subject && (
                          <motion.span 
                            whileHover={{ scale: 1.05 }}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block mt-1"
                          >
                            {resource.subject}
                          </motion.span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteResource(resource.id)}
                      className="text-red-500 hover:text-red-700 transition p-2"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                  
                  <div className="p-5">
                    {resource.description && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{resource.description}</p>
                    )}
                    <div className="mt-2">
                      <motion.a
                        whileHover={{ scale: 1.05, x: 5 }}
                        href={resource.resource_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-medium group"
                      >
                        <FaLink size={14} /> 
                        <span>Open Resource</span>
                        <motion.span
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="inline-block transition-transform group-hover:translate-x-1"
                        >
                          →
                        </motion.span>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default Resources;