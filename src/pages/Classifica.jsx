import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Classifica = () => {
  const [classifica, setClassifica] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchClassifica = async () => {
      try {
        const res = await fetch('/api/classifica', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setClassifica(data);
        } else {
          console.error('Errore nel recupero della classifica');
        }
      } catch (err) {
        console.error('Errore nel recupero della classifica:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassifica();
  }, [token]);

  const getMedalEmoji = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏓';
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-400 to-gray-600';
      case 3: return 'from-amber-600 to-amber-800';
      default: return 'from-blue-500 to-blue-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🏓</div>
          <p className="text-xl text-gray-600">Caricamento classifica...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🏆 Classifica Torneo
          </h1>
          <p className="text-xl text-gray-600">
            Posizioni aggiornate in tempo reale
          </p>
        </div>

        {/* Legenda */}
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">📊 Legenda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Posizione valida (≥5 partite giocate)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span>Posizione provvisoria (&lt;5 partite)</span>
            </div>
          </div>
        </div>

        {/* Classifica */}
        <div className="max-w-4xl mx-auto">
          {classifica.length > 0 ? (
            <div className="space-y-4">
              {classifica.map((player, index) => (
                <div
                  key={player.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    player.posizione_valida ? 'ring-2 ring-green-200' : 'ring-2 ring-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Posizione e Nome */}
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getPositionColor(player.posizione)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                          {getMedalEmoji(player.posizione)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            #{player.posizione} {player.nome} {player.cognome}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>⚔️ {player.partite_giocate} partite</span>
                            <span>🏆 {player.vittorie} vittorie</span>
                          </div>
                        </div>
                      </div>

                      {/* Statistiche */}
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {player.percentuale_vittorie !== null 
                            ? `${player.percentuale_vittorie}%` 
                            : 'N/A'
                          }
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          player.posizione_valida 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {player.posizione_valida ? 'Qualificato' : 'In attesa'}
                        </div>
                      </div>
                    </div>

                    {/* Barra di progresso */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progresso verso qualificazione</span>
                        <span>{Math.min(player.partite_giocate, 5)}/5 partite</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            player.posizione_valida ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min((player.partite_giocate / 5) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏓</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Nessun partecipante nella classifica
              </h3>
              <p className="text-gray-600">
                I risultati appariranno quando verranno giocate le prime partite
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>🏓 La classifica viene aggiornata automaticamente dopo ogni partita 🏓</p>
        </div>
      </div>
    </div>
  );
};

export default Classifica;