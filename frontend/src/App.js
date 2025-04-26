import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DoctorRegistrationPage from './pages/DoctorRegistrationPage';
import ClientsPage from './pages/ClientsPage';
import ProgramsPage from './pages/ProgramsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-doctor" element={<DoctorRegistrationPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
