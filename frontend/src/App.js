// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ToDo from './components/ToDoList';
import Pomodoro from './components/PomodoroTimer';
import ResourcesPage from './components/Resources';
import ResourceUpload from './components/ResourcesUpload';
import StudyGroups from './components/Studygroup';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/todo" element={<ToDo />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/upload" element={<ResourceUpload />} />
        <Route path="/studygroups" element={<StudyGroups />} />
        
      </Routes>
    </Router>
  );
}

export default App;