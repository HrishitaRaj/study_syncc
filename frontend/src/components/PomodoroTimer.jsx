import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Pomodoro = () => {
  const WORK_DURATION = 25 * 60;
  const SHORT_BREAK_DURATION = 5 * 60;
  const LONG_BREAK_DURATION = 15 * 60;

  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' | 'short' | 'long'
  const [completedSessions, setCompletedSessions] = useState(0);
  const timerRef = useRef(null);
  const sessionStartTimeRef = useRef(new Date());

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getModeDuration = (mode) => {
    if (mode === 'work') return WORK_DURATION;
    if (mode === 'short') return SHORT_BREAK_DURATION;
    return LONG_BREAK_DURATION;
  };

  const getNextMode = () => {
    if (mode === 'work') {
      return (completedSessions + 1) % 4 === 0 ? 'long' : 'short';
    }
    return 'work';
  };

  useEffect(() => {
    if (isRunning) {
      sessionStartTimeRef.current = new Date();
  
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) return prev - 1;
  
          clearInterval(timerRef.current);
  
          const endTime = new Date();
          const duration = getModeDuration(mode);
  
          // Log session to backend
          axios.post('http://localhost:5000/api/pomodoro', {
            user_id: localStorage.getItem('userId'), // replace with dynamic user ID
            mode,
            start_time: sessionStartTimeRef.current.toISOString(),
            end_time: endTime.toISOString(),
            duration_seconds: duration,
          }).catch(err => console.error('Log session error:', err));
  
          if (mode === 'work') setCompletedSessions((c) => c + 1);
  
          const nextMode = getNextMode();
          setMode(nextMode);
          setTimeLeft(getModeDuration(nextMode));
          return 0;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setMode('work');
    setTimeLeft(WORK_DURATION);
    setCompletedSessions(0);
  };

  const totalDuration = getModeDuration(mode);
  const percentage = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-red-100 via-pink-50 to-white">
      <Navbar />
      <div className="max-w-xl mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-10 rounded-3xl shadow-2xl border border-red-100 text-center"
        >
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 tracking-tight">
            {mode === 'work'
              ? 'Focus Session'
              : mode === 'short'
              ? 'Short Break'
              : 'Long Break'}
          </h2>

          {/* Circular Progress */}
          <div className="relative w-60 h-60 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="120"
                cy="120"
                r="100"
                stroke="#eee"
                strokeWidth="18"
                fill="none"
              />
              <motion.circle
                cx="120"
                cy="120"
                r="100"
                stroke={mode === 'work' ? '#10b981' : mode === 'short' ? '#3b82f6' : '#f59e0b'}
                strokeWidth="18"
                fill="none"
                strokeDasharray={2 * Math.PI * 100}
                strokeDashoffset={(1 - percentage / 100) * 2 * Math.PI * 100}
                strokeLinecap="round"
                initial={false}
                animate={{ strokeDashoffset: (1 - percentage / 100) * 2 * Math.PI * 100 }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-mono text-gray-900">{formatTime(timeLeft)}</div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mb-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStartPause}
              className={`px-8 py-3 rounded-full font-semibold shadow transition-all duration-300 ${
                isRunning
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-8 py-3 rounded-full font-semibold bg-red-500 hover:bg-red-600 text-white shadow transition-all duration-300"
            >
              Reset
            </motion.button>
          </div>

          <p className="text-gray-600">
            Completed Sessions: <span className="font-bold text-gray-800">{completedSessions}</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Pomodoro;
