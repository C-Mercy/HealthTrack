import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ClientsPage from './pages/ClientsPage';
import ProgramsPage from './pages/ProgramsPage';
import DoctorRegistrationPage from './pages/DoctorRegistrationPage';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-doctor" element={<DoctorRegistrationPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/programs" element={<ProgramsPage />} />

        <Route path="/homepage" element={<HomePage/>} />     
         </Routes>
    </Router>
  );
}

export default App;
