import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';  // ← CORRETTO
import { createApiUrl } from '../config/api';       // ← AGGIUNTO

const GestioneIncontri = () => {
  const [incontri, setIncontri] = useState([]);
  const [partecipanti, setPartecipanti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    partecipante_a_id: '',
    partecipante_b_id: '',
    data: '',
    punti_a: '',
    punti_b: '',
  });
  const { token } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incontriRes, partecipantiRes] = await Promise.all([
        fetch(createApiUrl('/api/incontri'), {  // ← CORRETTO
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(createApiUrl('/api/partecipanti'), {  // ← CORRETTO
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (incontriRes.ok && partecipantiRes.ok) {
        const [incontriData, partecipantiData] = await Promise.all([
          incontriRes.json(),
          partecipantiRes.json()
        ]);
        setIncontri(incontriData);
        setPartecipanti(partecipantiData);
      }
    } catch (err) {
      console.error('Errore nel recupero dei dati:', err);
      setMessage('❌ Errore nel recupero dei dati');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.partecipante_a_id || !formData.partecipante_b_id || !formData.data) {
      setMessage('❌ Tutti i campi obbligatori devono essere compilati');
      return false;
    }
    
    if (formData.partecipante_a_id === formData.partecipante_b_id) {
      setMessage('❌ I partecipanti devono essere diversi');
      return false;
    }

    // Validazione ping-pong se sono inseriti i punti
    if (formData.punti_a && formData.punti_b) {
      const pA = parseInt(formData.punti_a);
      const pB = parseInt(formData.punti_b);
      
      if (pA < 0 || pB < 0) {
        setMessage('❌ I punti devono essere numeri non negativi');
        return false;
      }
      
      if (pA === pB) {
        setMessage('❌ Una partita non può finire in pareggio');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setMessage('');

    try {
      const payload = {
        partecipante_a_id: parseInt(formData.partecipante_a_id),
        partecipante_b_id: parseInt(formData.partecipante_b_id),
        data: formData.data,
        ...(formData.punti_a && formData.punti_b && {
          punti_a: parseInt(formData.punti_a),
          punti_b: parseInt(formData.punti_b)
        })
      };

      const url = editingId ? `/api/incontri/${editingId}` : '/api/incontri';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(createApiUrl(url), {  // ← CORRETTO
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Incontro ${editingId ? 'aggiornato' : 'creato'} con successo!`);
        resetForm();
        fetchData();
      } else {
        setMessage(`❌ ${data.error || 'Errore nell\'operazione'}`);
      }
    } catch (err) {
      console.error('Errore:', err);
      setMessage('❌ Errore di connessione');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (incontro) => {
    setEditingId(incontro.id);
    setFormData({
      partecipante_a_id: incontro.partecipante_a_id,
      partecipante_b_id: incontro.partecipante_b_id,
      data: incontro.data,
      punti_a: incontro.punti_a || '',
      punti_b: incontro.punti_b || '',
    });
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo incontro?')) return;

    try {
      const res = await fetch(createApiUrl(`/api/incontri/${id}`), {  // ← CORRETTO
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setMessage('✅ Incontro eliminato con successo!');
        fetchData();
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.error || 'Errore nell\'eliminazione'}`);
      }
    } catch (err) {
      console.error('Errore:', err);
      setMessage('❌ Errore di connessione');
    }
  };

  const resetForm = () => {
    setFormData({
      partecipante_a_id: '',
      partecipante_b_id: '',
      data: '',
      punti_a: '',
      punti_b: '',
    });
    setEditingId(null);
    setMessage('');
  };

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚙️</div>
          <p className="text-xl text-gray-600">Caricamento gestione incontri...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
            ⚙️ Gestione Incontri
          </h1>
          <p className="text-xl text-gray-600">
            Crea, modifica e gestisci tutti gli incontri del torneo
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className={`rounded-2xl shadow-lg p-4 text-center font-medium ${
              message.startsWith('✅') 
                ? 'bg-green-100 border border-green-200 text-green-800' 
                : 'bg-red-100 border border-red-200 text-red-800'
            }`}>
              {message}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {editingId ? '✏️ Modifica Incontro' : '➕ Crea Nuovo Incontro'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Partecipanti */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    👤 Giocatore A
                  </label>
                  <select
                    name="partecipante_a_id"
                    value={formData.partecipante_a_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 focus:bg-white transition-all duration-200"
                  >
                    <option value="">Seleziona giocatore A</option>
                    {partecipanti.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome} {p.cognome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    👤 Giocatore B
                  </label>
                  <select
                    name="partecipante_b_id"
                    value={formData.partecipante_b_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 focus:bg-white transition-all duration-200"
                  >
                    <option value="">Seleziona giocatore B</option>
                    {partecipanti.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome} {p.cognome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  📅 Data Incontro
                </label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 focus:bg-white transition-all duration-200"
                />
              </div>

              {/* Punteggi (opzionali) */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  🏓 Risultato Partita (Opzionale)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Punti Giocatore A
                    </label>
                    <input
                      type="number"
                      name="punti_a"
                      value={formData.punti_a}
                      onChange={handleChange}
                      min="0"
                      placeholder="es. 11"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Punti Giocatore B
                    </label>
                    <input
                      type="number"
                      name="punti_b"
                      value={formData.punti_b}
                      onChange={handleChange}
                      min="0"
                      placeholder="es. 9"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all duration-200"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  💡 Inserisci i punti solo se la partita è già stata giocata
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {editingId ? 'Aggiornamento...' : 'Creazione...'}
                    </div>
                  ) : (
                    editingId ? '💾 Salva Modifiche' : '➕ Crea Incontro'
                  )}
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    ❌ Annulla
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Incontri List */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6">
              <h3 className="text-2xl font-bold text-center">
                📋 Incontri Esistenti ({incontri.length})
              </h3>
            </div>
            
            <div className="p-6">
              {incontri.length > 0 ? (
                <div className="space-y-4">
                  {incontri.map((incontro, index) => (
                    <div
                      key={incontro.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: 'fadeIn 0.6s ease-out forwards'
                      }}
                    >
                      <div className="flex flex-col lg:flex-row items-center justify-between">
                        {/* Match Info */}
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-center justify-center lg:justify-start mb-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              incontro.giocato 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {incontro.giocato ? '✅ Completato' : '⏳ Programmato'}
                            </span>
                          </div>
                          
                          <div className="text-lg font-semibold text-gray-800 text-center lg:text-left">
                            {incontro.nome_a} {incontro.cognome_a} 
                            <span className="mx-2 text-gray-400">vs</span>
                            {incontro.nome_b} {incontro.cognome_b}
                          </div>
                          
                          <div className="text-sm text-gray-600 text-center lg:text-left">
                            📅 {new Date(incontro.data).toLocaleDateString('it-IT')}
                            {incontro.giocato && (
                              <span className="ml-4">
                                🏓 {incontro.punti_a} - {incontro.punti_b}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(incontro)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                          >
                            ✏️ Modifica
                          </button>
                          <button
                            onClick={() => handleDelete(incontro.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                          >
                            🗑️ Elimina
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏓</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Nessun incontro creato
                  </h3>
                  <p className="text-gray-600">
                    Crea il primo incontro per iniziare il torneo!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestioneIncontri;