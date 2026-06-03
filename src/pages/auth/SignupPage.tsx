import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Vault } from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { useAuthStore } from '../../store/useAuthStore';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setPendingSignup } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', familyName: '', terms: false });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.terms) return;
    setLoading(true);
    setPendingSignup({ name: form.name, email: form.email, password: form.password, familyName: form.familyName });
    setTimeout(() => { setLoading(false); navigate('/onboarding'); }, 500);
  };

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl shadow-purple-100 w-full max-w-sm p-7">
        <div className="flex flex-col items-center mb-7">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-purple-200">
            <Vault className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">Rejoignez TiPoche gratuitement</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Votre prénom</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Sophie"
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Nom de la famille</label>
            <input
              type="text"
              value={form.familyName}
              onChange={e => set('familyName', e.target.value)}
              placeholder="Famille Martin"
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="vous@exemple.ch"
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Minimum 8 caractères"
                minLength={8}
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm pr-11"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={e => set('terms', e.target.checked)}
              className="w-5 h-5 rounded-lg border-2 border-gray-300 text-purple-600 mt-0.5 shrink-0"
              required
            />
            <span className="text-sm text-gray-600">
              J'accepte les{' '}
              <span className="text-purple-600 font-semibold">conditions d'utilisation</span>
              {' '}et la{' '}
              <span className="text-purple-600 font-semibold">politique de confidentialité</span>
            </span>
          </label>

          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} disabled={!form.terms}>
            Créer mon compte
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};
