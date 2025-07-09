import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // ← CORRETTO
import { createApiUrl } from '../config/api';       // ← AGGIUNTO

export default function Dashboard() {
  const { userDetails, token, updateUserDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleIscrizioneTorneo = async () => {
    setLoading(true);
    try {
      const res = await fetch(createApiUrl('/api/torneo/iscriviti'), {  // ← CORRETTO
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        updateUserDetails({ ...userDetails, iscritto_al_torneo: true });
        setMessage('✅ Iscrizione al torneo completata!');
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Errore durante l\'iscrizione');
    } finally {
      setLoading(false);
    }
  };

  const handleDiventaOrganizzatore = async () => {
    setLoading(true);
    try {
      const res = await fetch(createApiUrl('/api/torneo/sono-un-organizzatore'), {  // ← CORRETTO
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        updateUserDetails({ ...userDetails, organizzatore_del_torneo: true });
        setMessage('✅ Ora sei un organizzatore!');
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Errore durante l\'operazione');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header con gradiente */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🏓 Dashboard Torneo
          </h1>
          <p className="text-xl text-gray-600">
            Benvenuto, <span className="font-semibold text-blue-600">{userDetails?.nome} {userDetails?.cognome}</span>
          </p>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Partecipazione</h3>
                <p className="text-gray-600">
                  {userDetails?.iscritto_al_torneo ? '✅ Iscritto al torneo' : '❌ Non ancora iscritto'}
                </p>
              </div>
              <div className="text-3xl">
                {userDetails?.iscritto_al_torneo ? '🎯' : '📝'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Ruolo</h3>
                <p className="text-gray-600">
                  {userDetails?.organizzatore_del_torneo ? '👑 Organizzatore' : '👤 Partecipante'}
                </p>
              </div>
              <div className="text-3xl">
                {userDetails?.organizzatore_del_torneo ? '⚙️' : '🏃'}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {!userDetails?.iscritto_al_torneo && (
            <button
              onClick={handleIscrizioneTorneo}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? '⏳ Iscrizione...' : '🎯 Iscriviti al Torneo'}
            </button>
          )}
          
          {!userDetails?.organizzatore_del_torneo && (
            <button
              onClick={handleDiventaOrganizzatore}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? '⏳ Elaborazione...' : '👑 Diventa Organizzatore'}
            </button>
          )}
        </div>

        {/* Message display */}
        {message && (
          <div className="text-center mb-8">
            <div className="inline-block bg-white rounded-lg shadow-md px-6 py-3 border-l-4 border-green-500">
              <p className="text-gray-800 font-medium">{message}</p>
            </div>
          </div>
        )}

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/partecipanti"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 transform hover:scale-105 border-t-4 border-blue-500"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:animate-bounce">👥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Partecipanti</h3>
              <p className="text-gray-600">Visualizza tutti i partecipanti al torneo</p>
            </div>
          </Link>

          <Link
            to="/incontri"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 transform hover:scale-105 border-t-4 border-green-500"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:animate-bounce">⚔️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Incontri</h3>
              <p className="text-gray-600">Vedi tutti gli incontri del torneo</p>
            </div>
          </Link>

          <Link
            to="/classifica"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 transform hover:scale-105 border-t-4 border-purple-500"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:animate-bounce">🏆</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Classifica</h3>
              <p className="text-gray-600">Consulta la classifica aggiornata</p>
            </div>
          </Link>

          {userDetails?.organizzatore_del_torneo && (
            <Link
              to="/gestione-incontri"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 transition-all duration-300 transform hover:scale-105 border-t-4 border-red-500 md:col-span-2 lg:col-span-1"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:animate-bounce">⚙️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Gestione Incontri</h3>
                <p className="text-gray-600">Crea e gestisci gli incontri del torneo</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}