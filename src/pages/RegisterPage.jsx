import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createApiUrl } from "../config/api";

const RegisterPage = () => {
  const [form, setForm] = useState({ nome: "", cognome: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(createApiUrl("/api/utenti/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore nella registrazione");
      }

      // Successo - reindirizza al login
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo e titolo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🏓</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Torneo PingPong
          </h1>
          <p className="text-gray-600 mt-2">Crea il tuo account</p>
        </div>

        {/* Form container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome e Cognome */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  👤 Nome
                </label>
                <input
                  name="nome"
                  type="text"
                  placeholder="Nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  👤 Cognome
                </label>
                <input
                  name="cognome"
                  type="text"
                  placeholder="Cognome"
                  value={form.cognome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                📧 Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Inserisci la tua email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Password input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                🔒 Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Inserisci la tua password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">❌ {error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Registrazione in corso...
                </div>
              ) : (
                "🚀 Registrati"
              )}
            </button>
          </form>

          {/* Link to login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Hai già un account?{' '}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200"
              >
                Accedi qui
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>🏓 Unisciti al torneo aziendale! 🏓</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;