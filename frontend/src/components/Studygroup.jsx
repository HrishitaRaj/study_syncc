import { useState } from 'react';
import { Search, Plus, Users, LogOut, LogIn, X, BookOpen, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudyGroups() {
  const [studyGroups, setStudyGroups] = useState([
    { 
      id: 1, 
      name: 'Biology 101', 
      description: 'Study group for Biology 101 course focusing on cellular biology and genetics.',
      members: 8,
      joined: true,
      meetingTime: 'Tuesdays at 4:00 PM',
      location: 'Library, Room 204'
    },
    { 
      id: 2, 
      name: 'Data Structures', 
      description: 'Computer Science study group covering advanced data structures and algorithms.',
      members: 12,
      joined: false,
      meetingTime: 'Wednesdays at 6:30 PM',
      location: 'CS Building, Lab 3'
    },
    { 
      id: 3, 
      name: 'Calculus II', 
      description: 'Mathematics study group for students taking Calculus II this semester.',
      members: 15,
      joined: false,
      meetingTime: 'Fridays at 3:00 PM',
      location: 'Math Center, Room 115'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    meetingTime: '',
    location: ''
  });

  // Filter study groups based on search term
  const filteredGroups = studyGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle join/leave group
  const toggleJoinGroup = (groupId) => {
    setStudyGroups(studyGroups.map(group => {
      if (group.id === groupId) {
        const updatedGroup = { ...group, joined: !group.joined };
        if (group.joined) {
          updatedGroup.members -= 1;
        } else {
          updatedGroup.members += 1;
        }
        return updatedGroup;
      }
      return group;
    }));

    // If it's the currently selected group, update that too
    if (selectedGroup && selectedGroup.id === groupId) {
      setSelectedGroup(prevGroup => ({
        ...prevGroup,
        joined: !prevGroup.joined,
        members: prevGroup.joined ? prevGroup.members - 1 : prevGroup.members + 1
      }));
    }
  };

  // Create new study group
  const handleCreateGroup = () => {
    const newGroupData = {
      id: studyGroups.length + 1,
      ...newGroup,
      members: 1,
      joined: true
    };
    
    setStudyGroups([...studyGroups, newGroupData]);
    setNewGroup({ name: '', description: '', meetingTime: '', location: '' });
    setShowCreateModal(false);
  };

  // Show details of selected group
  const openGroupDetails = (group) => {
    setSelectedGroup(group);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left sidebar - Group listing */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-1/3 bg-white shadow-lg overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold mb-5 text-slate-800">Study Groups</h2>
          <div className="flex items-center mb-5 bg-slate-50 rounded-xl p-3 shadow-sm">
            <Search className="text-slate-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search study groups..."
              className="bg-transparent border-none outline-none w-full text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition font-medium shadow-md"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} className="mr-2" /> Create Study Group
          </motion.button>
        </div>

        <div className="p-4">
          <AnimatePresence>
            {filteredGroups.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-slate-500 py-8"
              >
                No study groups found
              </motion.p>
            ) : (
              filteredGroups.map(group => (
                <motion.div 
                  key={group.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 mb-3 rounded-xl cursor-pointer transition shadow-sm ${
                    selectedGroup?.id === group.id 
                      ? 'bg-indigo-50 border-l-4 border-indigo-500' 
                      : 'bg-white hover:bg-slate-50'
                  }`}
                  onClick={() => openGroupDetails(group)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold ${selectedGroup?.id === group.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {group.name}
                    </h3>
                    <div className="flex items-center text-slate-600 text-sm bg-slate-100 px-2 py-1 rounded-full">
                      <Users size={14} className="mr-1" /> 
                      <span>{group.members}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">{group.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 flex items-center">
                      <Clock size={12} className="mr-1" /> {group.meetingTime}
                    </span>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        group.joined 
                          ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' 
                          : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleJoinGroup(group.id);
                      }}
                    >
                      {group.joined ? 'Leave' : 'Join'}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right panel - Group details */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-2/3 bg-slate-50 p-8 overflow-y-auto"
      >
        <AnimatePresence mode="wait">
          {selectedGroup ? (
            <motion.div
              key={selectedGroup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-8">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-bold text-slate-800"
                >
                  {selectedGroup.name}
                </motion.h1>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-5 py-2 rounded-xl shadow-md font-medium ${
                    selectedGroup.joined 
                      ? 'bg-rose-600 text-white hover:bg-rose-700' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                  onClick={() => toggleJoinGroup(selectedGroup.id)}
                >
                  {selectedGroup.joined ? (
                    <>
                      <LogOut size={18} className="mr-2" /> Leave Group
                    </>
                  ) : (
                    <>
                      <LogIn size={18} className="mr-2" /> Join Group
                    </>
                  )}
                </motion.button>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-md mb-8 border border-slate-100"
              >
                <div className="flex items-center mb-4 text-indigo-600">
                  <BookOpen size={22} className="mr-2" />
                  <h2 className="text-xl font-semibold">About this group</h2>
                </div>
                <p className="text-slate-700 mb-6 text-lg leading-relaxed">{selectedGroup.description}</p>
                
                <div className="grid grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-50 p-4 rounded-xl"
                  >
                    <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center">
                      <Clock size={14} className="mr-1" /> Meeting Time
                    </h3>
                    <p className="text-slate-800 font-medium">{selectedGroup.meetingTime}</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-50 p-4 rounded-xl"
                  >
                    <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center">
                      <MapPin size={14} className="mr-1" /> Location
                    </h3>
                    <p className="text-slate-800 font-medium">{selectedGroup.location}</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-50 p-4 rounded-xl"
                  >
                    <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center">
                      <Users size={14} className="mr-1" /> Members
                    </h3>
                    <p className="text-slate-800 font-medium">{selectedGroup.members} participants</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-50 p-4 rounded-xl"
                  >
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Status</h3>
                    <p className={`font-medium ${selectedGroup.joined ? "text-emerald-600" : "text-slate-600"}`}>
                      {selectedGroup.joined ? "Joined" : "Not Joined"}
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Additional sections could be added here (members list, upcoming meetings, etc) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-md border border-slate-100"
              >
                <div className="flex items-center mb-6 text-indigo-600">
                  <Users size={22} className="mr-2" />
                  <h2 className="text-xl font-semibold">Group Members</h2>
                </div>
                <div className="bg-slate-50 rounded-xl p-6">
                  <p className="text-center text-slate-600 py-6 font-medium">
                    {selectedGroup.joined 
                      ? "You're a member of this group. Full member list would appear here." 
                      : "Join this group to see its members."}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-slate-500"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white p-12 rounded-2xl shadow-md mb-6 flex flex-col items-center"
              >
                <Users size={80} className="mb-6 text-indigo-500" />
                <p className="text-2xl font-medium text-slate-700 mb-2">Select a study group</p>
                <p className="text-slate-500 mb-8 text-center">Choose from the list or create your own group</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white py-3 px-8 rounded-xl hover:bg-indigo-700 transition font-medium shadow-md flex items-center"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={20} className="mr-2" /> Create a new study group
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Create group modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-800">Create Study Group</h2>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-slate-500 hover:text-slate-700 bg-white rounded-full p-2 shadow-sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  <X size={20} />
                </motion.button>
              </div>
              
              <div className="p-6">
                <div className="mb-5">
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Group Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    placeholder="Enter group name"
                  />
                </div>
                
                <div className="mb-5">
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 border border-slate-200 rounded-xl h-28 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    placeholder="Describe the purpose and focus of this study group"
                  ></textarea>
                </div>
                
                <div className="mb-5">
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Meeting Time
                  </label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      className="w-full p-3 pl-9 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      value={newGroup.meetingTime}
                      onChange={(e) => setNewGroup({...newGroup, meetingTime: e.target.value})}
                      placeholder="e.g., Mondays at 5:00 PM"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      className="w-full p-3 pl-9 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      value={newGroup.location}
                      onChange={(e) => setNewGroup({...newGroup, location: e.target.value})}
                      placeholder="Where will the group meet?"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 bg-slate-200 rounded-xl hover:bg-slate-300 transition font-medium text-slate-700"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium shadow-md disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    onClick={handleCreateGroup}
                    disabled={!newGroup.name || !newGroup.description}
                  >
                    Create Group
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}