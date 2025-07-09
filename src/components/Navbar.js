import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, userDetails, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, className = '' }) => (
    <Link
      to={to}
      className={`relative px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
        isActive(to)
          ? 'text-blue-600 bg-blue-50 shadow-md'
          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
      } ${className}`}
    >
      {children}
      {isActive(to) && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>
      )}
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="text-2xl group-hover:animate-spin">🏓</div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Torneo PingPong
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <NavLink to="/dashboard">🏠 Dashboard</NavLink>
                <NavLink to="/partecipanti">👥 Partecipanti</NavLink>
                <NavLink to="/incontri">⚔️ Incontri</NavLink>
                <NavLink to="/classifica">🏆 Classifica</NavLink>
                {userDetails?.organizzatore_del_torneo && (
                  <NavLink to="/gestione-incontri">⚙️ Gestione</NavLink>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {userDetails?.nome} {userDetails?.cognome}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink to="/login">🔑 Login</NavLink>
                <NavLink to="/register" className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white">
                  📝 Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg mx-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      👋 {userDetails?.nome} {userDetails?.cognome}
                    </span>
                  </div>
                  <NavLink to="/dashboard">🏠 Dashboard</NavLink>
                  <NavLink to="/partecipanti">👥 Partecipanti</NavLink>
                  <NavLink to="/incontri">⚔️ Incontri</NavLink>
                  <NavLink to="/classifica">🏆 Classifica</NavLink>
                  {userDetails?.organizzatore_del_torneo && (
                    <NavLink to="/gestione-incontri">⚙️ Gestione</NavLink>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login">🔑 Login</NavLink>
                  <NavLink to="/register">📝 Register</NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}