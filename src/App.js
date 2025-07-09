import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Partecipanti from './pages/Partecipanti';
import Incontri from './pages/Incontri';
import GestioneIncontri from './pages/GestioneIncontri';
import Classifica from './pages/Classifica';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />
        <Route path="/register" element={
          user ? <Navigate to="/dashboard" replace /> : <RegisterPage />
        } />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/partecipanti" element={
          <ProtectedRoute>
            <Partecipanti />
          </ProtectedRoute>
        } />
        
        <Route path="/incontri" element={
          <ProtectedRoute>
            <Incontri />
          </ProtectedRoute>
        } />
        
        <Route path="/classifica" element={
          <ProtectedRoute>
            <Classifica />
          </ProtectedRoute>
        } />
        
        <Route path="/gestione-incontri" element={
          <ProtectedRoute organizerOnly={true}>
            <GestioneIncontri />
          </ProtectedRoute>
        } />
        
        {/* Default redirects */}
        <Route path="/" element={
          <Navigate to={user ? "/dashboard" : "/login"} replace />
        } />
        
        {/* 404 page */}
        <Route path="*" element={
          <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🏓</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
              <p className="text-xl text-gray-600 mb-6">Pagina non trovata</p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Torna alla Dashboard
              </button>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;