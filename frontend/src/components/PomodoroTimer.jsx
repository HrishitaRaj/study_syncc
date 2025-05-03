import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-red-100">
      <Navbar />
      <div className="max-w-xl mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-10 rounded-2xl shadow-xl text-center"
        >
          <h2 className="text-3xl font-bold text-red-600 mb-6">🍅 Pomodoro Timer</h2>
          <div className="text-6xl font-mono text-gray-800 mb-6">{formatTime(timeLeft)}</div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStartPause}
              className={`px-6 py-2 rounded text-white ${
                isRunning ? 'bg-yellow-500' : 'bg-green-500'
              } hover:opacity-90 transition`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded bg-red-500 text-white hover:opacity-90 transition"
            >
              Reset
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pomodoro;
