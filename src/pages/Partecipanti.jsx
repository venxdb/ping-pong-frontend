import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createApiUrl } from '../config/api';

const Partecipanti = () => {
  const [partecipanti, setPartecipanti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartecipanti = async () => {
      try {
        const res = await fetch(createApiUrl('/api/partecipanti'), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 403) {
          setError('Devi essere iscritto al torneo per visualizzare i partecipanti');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setPartecipanti(data);
        } else {
          setError('Errore nel recupero dei partecipanti');
        }
      } catch (err) {
        console.error(err);
        setError('Errore di connessione');
      } finally {
        setLoading(false);
      }
    };

    fetchPartecipanti();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🏓</div>
          <p className="text-xl text-gray-600">Caricamento partecipanti...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
          <p className="text-lg text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Torna alla Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            👥 Partecipanti al Torneo
          </h1>
          <p className="text-xl text-gray-600">
            {partecipanti.length} {partecipanti.length === 1 ? 'campione iscritto' : 'campioni iscritti'}
          </p>
        </div>

        {/* Stats Card */}
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-600">{partecipanti.length}</div>
              <div className="text-green-700 font-medium">Partecipanti Totali</div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-600">🏓</div>
              <div className="text-blue-700 font-medium">Torneo Attivo</div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-600">∞</div>
              <div className="text-purple-700 font-medium">Partite Possibili</div>
            </div>
          </div>
        </div>

        {/* Participants Grid */}
        <div className="max-w-6xl mx-auto">
          {partecipanti.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partecipanti.map((partecipante, index) => (
                <div
                  key={partecipante.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeIn 0.6s ease-out forwards'
                  }}
                >
                  <div className="p-6">
                    {/* Avatar */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {partecipante.nome.charAt(0)}{partecipante.cognome.charAt(0)}
                      </div>
                    </div>

                    {/* Nome */}
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {partecipante.nome} {partecipante.cognome}
                      </h3>
                      <p className="text-sm text-gray-600">
                        📧 {partecipante.email}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center">
                      <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                        🎯 Iscritto
                      </span>
                    </div>
                  </div>

                  {/* Decorative bottom border */}
                  <div className="h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏓</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Nessun partecipante trovato
              </h3>
              <p className="text-gray-600 mb-6">
                Sembra che il torneo sia appena iniziato!
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Torna alla Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        {partecipanti.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                🏆 Pronto per la battaglia?
              </h3>
              <p className="text-gray-600 mb-6">
                Controlla gli incontri programmati e segui la classifica in tempo reale
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/incontri')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  ⚔️ Vedi Incontri
                </button>
                <button
                  onClick={() => navigate('/classifica')}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
                >
                  🏆 Classifica
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Partecipanti;