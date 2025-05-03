import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';

const ToDo = () => {
  const { state } = useLocation();
  const userId = state?.user?.id;
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState({
    text: '',
    priority: 'Medium',
    dueDate: '',
    notes: '',
  });

  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:5000/api/todo?userId=${userId}`);
    setTasks(res.data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!input.text.trim()) return;
  
    const res = await axios.post('http://localhost:5000/api/todo', {
      user_id: userId,
      text: input.text,
      priority: input.priority,
      dueDate: input.dueDate,
      notes: input.notes,
    });
  
    setTasks([res.data, ...tasks]);
    setInput({ text: '', priority: 'Medium', dueDate: '', notes: '' });
  };  

  const toggleTask = async (id, current) => {
    await axios.put('http://localhost:5000/api/todo', { id, completed: !current });
  
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !current } : task
      )
    );
  };  

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/todo/${id}`);
  
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };  

  useEffect(() => {
    if (userId) fetchTasks();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 tracking-tight">
            📋 Study To-Do List
          </h2>

          <form onSubmit={addTask} className="flex flex-col gap-4 mb-6">
            <input
              type="text"
              value={input.text}
              onChange={(e) => setInput({ ...input, text: e.target.value })}
              placeholder="Task title..."
              className="w-full border rounded-lg p-3"
              required
            />

            <div className="flex gap-4">
              <select
                value={input.priority}
                onChange={(e) => setInput({ ...input, priority: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <input
                type="date"
                value={input.dueDate}
                onChange={(e) => setInput({ ...input, dueDate: e.target.value })}
                className="border rounded-lg p-2"
              />
            </div>

            <textarea
              value={input.notes}
              onChange={(e) => setInput({ ...input, notes: e.target.value })}
              placeholder="Optional notes..."
              className="w-full border rounded-lg p-3"
              rows="2"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
            >
              Add
            </motion.button>
          </form>


          <ul className="space-y-4">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className={`flex justify-between items-center p-4 border rounded-xl shadow-sm hover:shadow-md transition-all ${
                    task.completed ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-1">
                    <p className={`text-lg font-medium ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}>
                      {task.text}
                    </p>

                    <div className="text-sm mt-1 space-y-1">
                      {task.priority && (
                        <p className={`italic ${
                          task.priority === 'High' ? 'text-red-500' :
                          task.priority === 'Medium' ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          Priority: {task.priority}
                        </p>
                      )}

                      {task.dueDate && (
                        <p className="text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}

                      {task.notes && (
                        <p className="text-gray-600">{task.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 text-2xl">
                    <motion.div
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleTask(task.id, task.completed)}
                      className={`cursor-pointer transition-all ${
                        task.completed ? 'text-green-500' : 'text-gray-400'
                      }`}
                    >
                      <FaCheckCircle />
                    </motion.div>

                    <motion.div
                      whileTap={{ scale: 0.8 }}
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 cursor-pointer"
                    >
                      <FaTrash />
                    </motion.div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default ToDo;
