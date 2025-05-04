import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaBook, FaSpinner, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ResourceUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    fileType: ''
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');

  // Mock course data - in a real app, this would come from an API
  const courses = [
    { id: 1, name: 'Introduction to Computer Science' },
    { id: 2, name: 'Advanced Mathematics' },
    { id: 3, name: 'Physics 101' },
    { id: 4, name: 'Data Structures and Algorithms' },
    { id: 5, name: 'English Literature' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      
      // Determine file type
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      let fileType = 'document';
      
      if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        fileType = 'image';
      } else if (['pdf'].includes(fileExtension)) {
        fileType = 'pdf';
      } else if (['doc', 'docx'].includes(fileExtension)) {
        fileType = 'word';
      } else if (['xls', 'xlsx'].includes(fileExtension)) {
        fileType = 'excel';
      } else if (['ppt', 'pptx'].includes(fileExtension)) {
        fileType = 'powerpoint';
      }
      
      setFormData({
        ...formData,
        fileType
      });
      
      // Create a preview URL for image files
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setErrorMessage('Please enter a title for your resource');
      return false;
    }
    if (!formData.courseId) {
      setErrorMessage('Please select a course');
      return false;
    }
    if (!file) {
      setErrorMessage('Please select a file to upload');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setUploading(true);
    setErrorMessage('');
    
    // FormData for file upload
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description || '');
    uploadData.append('courseId', formData.courseId);
    uploadData.append('fileType', formData.fileType);
    
    try {
      console.log("Uploading file:", file.name);
      console.log("Form data:", {
        title: formData.title,
        description: formData.description || '',
        courseId: formData.courseId,
        fileType: formData.fileType
      });
      
      const response = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        body: uploadData,
      });
      
      console.log('Response status:', response.status);
      const responseText = await response.text();
      
      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Response parsed as JSON:', result);
      } catch (e) {
        console.error('Response is not valid JSON:', responseText);
        throw new Error('Server returned invalid response');
      }
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`);
      }
      
      // Set uploadStatus to success
      setUploadStatus('success');
      
    } catch (error) {
      console.error('Error uploading resource:', error);
      setUploadStatus('error');
      setErrorMessage(error.message || 'Failed to upload resource. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      courseId: '',
      fileType: ''
    });
    setFile(null);
    setFilePreview(null);
    setUploadStatus(null);
    setErrorMessage('');
  };

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

  // Helper function to get file size display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Helper function to get file type icon
  const getFileTypeIcon = () => {
    switch (formData.fileType) {
      case 'pdf':
        return <span className="text-red-500">PDF</span>;
      case 'word':
        return <span className="text-blue-600">DOC</span>;
      case 'excel':
        return <span className="text-green-600">XLS</span>;
      case 'powerpoint':
        return <span className="text-orange-500">PPT</span>;
      default:
        return <FaBook className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50 py-12 px-4">
      <motion.div 
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaCloudUploadAlt className="text-3xl" />
              Upload Study Resource
            </h1>
            <p className="text-blue-100 mt-1">
              Share your notes, documents, and study materials with your peers
            </p>
          </div>

          {uploadStatus === 'success' ? (
            <motion.div 
              className="p-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-6">
                <motion.div 
                  className="text-green-500 text-6xl mb-6 inline-block"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7 }}
                >
                  <FaCheckCircle />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Successful!</h2>
                <p className="text-gray-600 mb-6">Your resource has been uploaded successfully.</p>
              </div>
              
              {/* Show file details even after successful upload */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  {filePreview ? (
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="h-16 w-16 object-cover rounded mr-4"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                      {getFileTypeIcon()}
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">Successfully uploaded</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <motion.button
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                >
                  Upload Another
                </motion.button>
                <motion.button
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/resources')}
                >
                  View All Resources
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* File Upload Area */}
                <motion.div 
                  className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center"
                  variants={itemVariants}
                  whileHover={{ borderColor: '#3b82f6' }}
                >
                  <input 
                    type="file" 
                    id="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                  
                  {file ? (
                    <div>
                      {filePreview ? (
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          className="max-h-40 mx-auto mb-4 rounded"
                        />
                      ) : (
                        <div className="h-20 w-20 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                          {getFileTypeIcon()}
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <p className="font-medium text-gray-800">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      
                      <motion.button
                        type="button"
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg inline-flex items-center"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFile(null);
                          setFilePreview(null);
                        }}
                      >
                        <FaTimes className="mr-2" /> Change File
                      </motion.button>
                    </div>
                  ) : (
                    <label htmlFor="file" className="cursor-pointer block">
                      <div className="text-blue-500 text-4xl mb-4 mx-auto">
                        <FaCloudUploadAlt className="mx-auto" />
                      </div>
                      <p className="text-gray-800 font-medium mb-1">
                        Drag and drop a file or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supported formats: PDF, Word, Excel, PowerPoint, Images
                      </p>
                      <motion.div
                        className="px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium inline-flex items-center"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaCloudUploadAlt className="mr-2" /> Select File
                      </motion.div>
                    </label>
                  )}
                </motion.div>

                {/* Form Fields */}
                <motion.div variants={itemVariants}>
                  <label className="block mb-2 font-medium text-gray-700">Resource Title *</label>
                  <input 
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="e.g., Physics Midterm Study Notes"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block mb-2 font-medium text-gray-700">Course *</label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block mb-2 font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Provide a brief description of this resource..."
                  ></textarea>
                </motion.div>

                {errorMessage && (
                  <motion.div 
                    className="bg-red-50 text-red-600 p-3 rounded-lg text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errorMessage}
                  </motion.div>
                )}

                <motion.div className="flex justify-end" variants={itemVariants}>
                  <motion.button
                    type="button"
                    className="px-5 py-2 mr-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium flex items-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" /> Uploading...
                      </>
                    ) : uploadStatus === 'error' ? (
                      'Try Again'
                    ) : (
                      <>
                        <FaCloudUploadAlt className="mr-2" /> Upload Resource
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResourceUpload;