import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Vault } from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { useAuthStore } from '../../store/useAuthStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/parent');
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  const fillDemo = () => {
    setEmail('demo@familyvault.ch');
    setPassword('demo1234');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl shadow-purple-100 w-full max-w-sm p-7">
        {/* Logo */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-purple-200">
            <Vault className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">TiPoche</h1>
          <p className="text-gray-500 text-sm mt-1">Les tâches qui rapportent</p>
        </div>

        {/* Demo button */}
        <button
          type="button"
          onClick={fillDemo}
          className="w-full mb-5 py-2.5 border-2 border-dashed border-purple-300 text-purple-600 rounded-2xl text-sm font-semibold hover:bg-purple-50 transition-colors"
        >
          🎮 Connexion démo (demo@tipoche.ch)
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="sophie@exemple.ch"
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-2xl px-3 py-2 font-medium">
              ❌ {error}
            </div>
          )}

          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
            Se connecter
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Pas encore de compte ?{' '}
          <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>
        <p className="text-center text-sm text-gray-400 mt-2">
          <Link to="/landing" className="hover:underline">← Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  );
};
