import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createApiUrl } from '../context/AuthContext';

const Incontri = () => {
  const [incontri, setIncontri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('tutti'); // 'tutti', 'completati', 'programmati'
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncontri = async () => {
      try {
        const res = await fetch(createApiUrl('/api/incontri'), {
        headers: { Authorization: `Bearer ${token}` },
      });

        if (res.status === 403) {
          setError('Devi essere iscritto al torneo per visualizzare gli incontri');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setIncontri(data);
        } else {
          setError('Errore nel recupero degli incontri');
        }
      } catch (err) {
        console.error(err);
        setError('Errore di connessione');
      } finally {
        setLoading(false);
      }
    };

    fetchIncontri();
  }, [token, navigate]);

  const incontriFiltered = incontri.filter(incontro => {
    if (filtro === 'completati') return incontro.giocato;
    if (filtro === 'programmati') return !incontro.giocato;
    return true;
  });

  const getStatusBadge = (incontro) => {
    if (incontro.giocato) {
      const vincitore = incontro.punti_a > incontro.punti_b ? 'A' : 'B';
      return {
        text: 'Completato',
        color: 'bg-green-500',
        icon: '✅'
      };
    } else {
      return {
        text: 'Programmato',
        color: 'bg-yellow-500',
        icon: '⏳'
      };
    }
  };

  const getWinnerInfo = (incontro) => {
    if (!incontro.giocato) return null;
    
    const isAWinner = incontro.punti_a > incontro.punti_b;
    return {
      winner: isAWinner ? 'A' : 'B',
      winnerName: isAWinner ? `${incontro.nome_a} ${incontro.cognome_a}` : `${incontro.nome_b} ${incontro.cognome_b}`,
      score: `${incontro.punti_a} - ${incontro.punti_b}`
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🏓</div>
          <p className="text-xl text-gray-600">Caricamento incontri...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            ⚔️ Incontri del Torneo
          </h1>
          <p className="text-xl text-gray-600">
            Segui tutte le battaglie del torneo
          </p>
        </div>

        {/* Stats e Filtri */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">📊 Statistiche</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">{incontri.length}</div>
                  <div className="text-blue-700 text-sm font-medium">Totali</div>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {incontri.filter(i => i.giocato).length}
                  </div>
                  <div className="text-green-700 text-sm font-medium">Completati</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {incontri.filter(i => !i.giocato).length}
                  </div>
                  <div className="text-yellow-700 text-sm font-medium">Programmati</div>
                </div>
              </div>
            </div>

            {/* Filtri */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">🔍 Filtri</h3>
              <div className="space-y-2">
                {[
                  { value: 'tutti', label: 'Tutti gli incontri', icon: '📋' },
                  { value: 'completati', label: 'Completati', icon: '✅' },
                  { value: 'programmati', label: 'Programmati', icon: '⏳' }
                ].map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => setFiltro(value)}
                    className={`w-full p-3 rounded-lg font-medium transition-all duration-200 ${
                      filtro === value
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Incontri List */}
        <div className="max-w-6xl mx-auto">
          {incontriFiltered.length > 0 ? (
            <div className="space-y-4">
              {incontriFiltered.map((incontro, index) => {
                const status = getStatusBadge(incontro);
                const winner = getWinnerInfo(incontro);
                
                return (
                  <div
                    key={incontro.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeIn 0.6s ease-out forwards'
                    }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row items-center justify-between">
                        {/* Match Info */}
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-center justify-center lg:justify-start mb-2">
                            <span className={`${status.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                              {status.icon} {status.text}
                            </span>
                          </div>
                          
                          {/* Players */}
                          <div className="flex items-center justify-center lg:justify-start space-x-4">
                            <div className="text-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mb-2">
                                {incontro.nome_a.charAt(0)}{incontro.cognome_a.charAt(0)}
                              </div>
                              <div className="text-sm font-medium text-gray-800">
                                {incontro.nome_a} {incontro.cognome_a}
                              </div>
                            </div>
                            
                            <div className="text-2xl font-bold text-gray-400">VS</div>
                            
                            <div className="text-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mb-2">
                                {incontro.nome_b.charAt(0)}{incontro.cognome_b.charAt(0)}
                              </div>
                              <div className="text-sm font-medium text-gray-800">
                                {incontro.nome_b} {incontro.cognome_b}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Match Details */}
                        <div className="text-center lg:text-right">
                          <div className="mb-2">
                            <span className="text-sm text-gray-600">
                              📅 {new Date(incontro.data).toLocaleDateString('it-IT', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          {incontro.giocato ? (
                            <div>
                              <div className="text-3xl font-bold text-gray-800 mb-1">
                                {incontro.punti_a} - {incontro.punti_b}
                              </div>
                              <div className="text-sm font-medium text-green-600">
                                🏆 Vince: {winner.winnerName}
                              </div>
                            </div>
                          ) : (
                            <div className="text-lg font-medium text-yellow-600">
                              ⏳ Da giocare
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative bottom border */}
                    <div className={`h-1 ${incontro.giocato ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}></div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏓</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Nessun incontro trovato
              </h3>
              <p className="text-gray-600 mb-6">
                {filtro === 'tutti' 
                  ? 'Non ci sono ancora incontri programmati' 
                  : `Nessun incontro ${filtro === 'completati' ? 'completato' : 'programmato'}`
                }
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
              >
                Torna alla Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        {incontri.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                🏆 Segui il torneo!
              </h3>
              <p className="text-gray-600 mb-6">
                Controlla la classifica aggiornata e vedi chi sta dominando il torneo
              </p>
              <button
                onClick={() => navigate('/classifica')}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              >
                🏆 Vedi Classifica
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Incontri;