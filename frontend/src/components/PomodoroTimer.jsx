import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Pomodoro = () => {
  const [customDurations, setCustomDurations] = useState({
    work: 25,
    short: 5,
    long: 15,
  });
  const [durationsInSeconds, setDurationsInSeconds] = useState({
    work: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
  });
  
  const [timeLeft, setTimeLeft] = useState(25*60);
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

  const getModeDuration = (mode) => durationsInSeconds[mode];

  const getNextMode = () => {
    if (mode === 'work') {
      return (completedSessions + 1) % 4 === 0 ? 'long' : 'short';
    }
    return 'work';
  };

  useEffect(() => {
    setDurationsInSeconds({
      work: customDurations.work * 60,
      short: customDurations.short * 60,
      long: customDurations.long * 60,
    });

    if (!isRunning) {
      setTimeLeft(customDurations[mode] * 60);
    }
  }, [customDurations]);

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
            user_id: localStorage.getItem('userId'), // Ensure this is set correctly in localStorage
            mode,
            start_time: sessionStartTimeRef.current.toISOString(),
            end_time: endTime.toISOString(),
            duration_seconds: duration,
          })
          .then((response) => {
            console.log('Session logged successfully:', response.data);
          })
          .catch((error) => {
            console.error('Error logging session:', error.response?.data || error);
          });

  
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
    setTimeLeft(durationsInSeconds.work);
    setCompletedSessions(0);
  };

  const totalDuration = getModeDuration(mode);
  const percentage = ((totalDuration - timeLeft) / totalDuration) * 100;
  const dailyGoal = 4;
  const progressPercent = Math.min((completedSessions / dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-200 to-orange-100">
      <Navbar />
      <div className="max-w-xl mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white/70 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-pink-200 text-center"
        >
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 tracking-tight">
            {mode === 'work'
              ? 'Focus Session'
              : mode === 'short'
              ? 'Short Break'
              : 'Long Break'}
          </h2>
  
          {/* Circular Progress */}
          <div className="relative w-64 h-64 mx-auto mb-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="100"
                stroke="#f3f4f6"
                strokeWidth="20"
                fill="none"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="100"
                stroke={mode === 'work' ? '#22c55e' : mode === 'short' ? '#3b82f6' : '#f59e0b'}
                strokeWidth="20"
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
              <div className="text-5xl font-mono text-gray-900">{formatTime(timeLeft)}</div>
            </div>
          </div>
  
          <div className="flex justify-center gap-6 mb-8">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStartPause}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold shadow-md transition-all duration-300 text-lg ${
                isRunning
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </motion.button>
  
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold bg-red-500 hover:bg-red-600 text-white shadow-md transition-all duration-300 text-lg"
            >
              Reset
            </motion.button>
          </div>
  
          <p className="text-gray-700 text-lg">
            Sessions Completed: <span className="font-bold text-gray-900">{completedSessions}</span>
          </p>

          {/* Daily Goal Progress bar*/}
          <div className="mb-8">
            <p className="text-gray-700 mb-1">Daily Goal: {completedSessions}/{dailyGoal}</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Customize Durations (minutes)</h3>
            <div className="grid grid-cols-3 gap-4">
              {['work', 'short', 'long'].map((type) => (
                <div key={type}>
                  <label className="block text-sm text-gray-600 capitalize">{type}</label>
                  <input
                    type="number"
                    min={1}
                    value={customDurations[type]}
                    onChange={(e) =>
                      setCustomDurations((prev) => ({
                        ...prev,
                        [type]: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full mt-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
  
};

export default Pomodoro;
