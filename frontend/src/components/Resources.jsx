import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  FaSearch, 
  FaPlus, 
  FaBook, 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaFilePowerpoint, 
  FaImage,
  FaDownload,
  FaStar,
  FaRegStar,
  FaFilter,
  FaTimes
} from 'react-icons/fa';

const ResourcesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const shouldRefresh = queryParams.get('refresh') === 'true';
  
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  // Mock course data - in a real app, this would come from an API
  const courses = [
    { id: 1, name: 'Introduction to Computer Science' },
    { id: 2, name: 'Advanced Mathematics' },
    { id: 3, name: 'Physics 101' },
    { id: 4, name: 'Data Structures and Algorithms' },
    { id: 5, name: 'English Literature' }
  ];
  
  // Mock file types for filtering
  const fileTypes = [
    { id: 'pdf', name: 'PDF', icon: <FaFilePdf className="text-red-500" /> },
    { id: 'word', name: 'Word', icon: <FaFileWord className="text-blue-600" /> },
    { id: 'excel', name: 'Excel', icon: <FaFileExcel className="text-green-600" /> },
    { id: 'powerpoint', name: 'PowerPoint', icon: <FaFilePowerpoint className="text-orange-500" /> },
    { id: 'image', name: 'Images', icon: <FaImage className="text-purple-500" /> }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
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

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    
    bytes = Number(bytes);
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Fetch resources function
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      
      try {
        // Fetch from your API - make sure to use the full URL during development
        const response = await fetch('http://localhost:5000/api/resources');
        
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        
        const data = await response.json();
        console.log('Fetched resources:', data);
        
        setResources(data);
        setFilteredResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
        // In development, fall back to mock data if API fails
        setResources([]);
        setFilteredResources([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResources();
  }, [shouldRefresh]);

  // Apply filters when search terms or filters change
  useEffect(() => {
    let results = resources;
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(resource => {
        return (
          resource.title.toLowerCase().includes(lowercasedTerm) ||
          resource.description.toLowerCase().includes(lowercasedTerm) ||
          resource.courseName.toLowerCase().includes(lowercasedTerm)
        );
      });
    }
    
    // Apply course filter
    if (selectedCourse) {
      results = results.filter(resource => resource.courseId.toString() === selectedCourse);
    }
    
    // Apply file type filter
    if (selectedFileType) {
      results = results.filter(resource => resource.fileType === selectedFileType);
    }
    
    setFilteredResources(results);
  }, [searchTerm, selectedCourse, selectedFileType, resources]);

  // Helper function to get file type icon
  const getFileTypeIcon = (fileType, className = "text-xl") => {
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className={`text-red-500 ${className}`} />;
      case 'word':
        return <FaFileWord className={`text-blue-600 ${className}`} />;
      case 'excel':
        return <FaFileExcel className={`text-green-600 ${className}`} />;
      case 'powerpoint':
        return <FaFilePowerpoint className={`text-orange-500 ${className}`} />;
      case 'image':
        return <FaImage className={`text-purple-500 ${className}`} />;
      default:
        return <FaBook className={`text-gray-500 ${className}`} />;
    }
  };

  // Render star rating
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
        ))}
        {hasHalfStar && <FaRegStar className="text-yellow-400 text-sm" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-sm" />
        ))}
        <span className="ml-1 text-gray-600 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleDownload = async (resourceId) => {
    try {
      // Create a download link and click it
      const downloadUrl = `http://localhost:5000/api/resources/${resourceId}/download`;
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading resource:', error);
      alert('Failed to download the resource. Please try again.');
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCourse('');
    setSelectedFileType('');
  };

  const activeFiltersCount = [
    searchTerm, 
    selectedCourse, 
    selectedFileType
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50 py-12 px-4">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FaBook className="text-2xl" />
                    Study Resources
                  </h1>
                  <p className="text-blue-100 mt-1">
                    Browse and download helpful study materials
                  </p>
                </div>
                <motion.button
                  className="mt-4 sm:mt-0 px-4 py-2 bg-white text-blue-700 rounded-lg font-medium flex items-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/resources/upload')}
                >
                  <FaPlus className="mr-2" /> Upload Resource
                </motion.button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Box */}
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                              
                {/* Desktop Filter Options */}
                <div className="hidden md:flex md:items-center gap-3">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                    value={selectedFileType}
                    onChange={(e) => setSelectedFileType(e.target.value)}
                  >
                    <option value="">All File Types</option>
                    {fileTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  
                  {activeFiltersCount > 0 && (
                    <motion.button
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center text-sm"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearFilters}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <FaTimes className="mr-1" /> Clear Filters ({activeFiltersCount})
                    </motion.button>
                  )}
                </div>
                
                {/* Mobile Filter Button */}
                <div className="md:hidden">
                  <motion.button
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium flex items-center justify-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                  >
                    <FaFilter className="mr-2" />
                    {filterMenuOpen ? "Hide Filters" : "Show Filters"}
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>
              
              {/* Mobile Filter Options */}
              {filterMenuOpen && (
                <motion.div 
                  className="mt-4 space-y-3 md:hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                    value={selectedFileType}
                    onChange={(e) => setSelectedFileType(e.target.value)}
                  >
                    <option value="">All File Types</option>
                    {fileTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  
                  {activeFiltersCount > 0 && (
                    <motion.button
                      className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center justify-center"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearFilters}
                    >
                      <FaTimes className="mr-2" /> Clear All Filters
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Resources Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredResources.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {filteredResources.map(resource => (
                <motion.div 
                  key={resource.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-blue-600 mb-2">
                          {resource.courseName}
                        </p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {getFileTypeIcon(resource.fileType)}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div>Uploaded: {formatDate(resource.uploadDate)}</div>
                      <div>{formatFileSize(resource.fileSize)}</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {renderRating(resource.rating)}
                      <div className="text-xs text-gray-500">{resource.downloadCount} downloads</div>
                    </div>
                  </div>
                      
                  <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      By {resource.uploadedBy}
                    </div>
                    <motion.button
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownload(resource.id)}
                    >
                      <FaDownload className="mr-1" /> Download
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white rounded-xl shadow-md p-10 text-center"
              variants={itemVariants}
            >
              <div className="text-gray-400 text-5xl mb-4">
                <FaSearch className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCourse || selectedFileType ? 
                  "Try adjusting your filters to find what you're looking for." : 
                  "It looks like there are no resources available yet."}
              </p>
              {(searchTerm || selectedCourse || selectedFileType) && (
                <motion.button
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium inline-flex items-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                >
                  <FaTimes className="mr-2" /> Clear All Filters
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div> 
  );
};

export default ResourcesPage;