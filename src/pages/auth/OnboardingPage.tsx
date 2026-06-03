import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, Copy } from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { useAuthStore } from '../../store/useAuthStore';

const CHILD_AVATARS = ['👦', '👧', '🧒', '👶', '🧑', '🐱', '🐶', '🦊', '🐻', '🦁'];
const PARENT_AVATARS = ['👩‍💼', '👨‍💼', '👩', '👨', '👩‍🦱', '👨‍🦱', '🧑‍💼', '👩‍🦰', '👨‍🦰', '👵'];

interface ChildInput {
  name: string;
  age: string;
  avatar: string;
  pin: string;
}

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createFamily, pendingSignup, currentFamily } = useAuthStore();
  const [step, setStep] = useState(1);
  const [familyName, setFamilyName] = useState(pendingSignup?.familyName ?? '');
  const [parentAvatar, setParentAvatar] = useState('👩‍💼');
  const [children, setChildren] = useState<ChildInput[]>([{ name: '', age: '', avatar: '👦', pin: '' }]);
  const [copied, setCopied] = useState(false);
  const inviteCode = currentFamily?.inviteCode ?? '------';

  const addChild = () => {
    if (children.length < 4) {
      setChildren(c => [...c, { name: '', age: '', avatar: CHILD_AVATARS[c.length % CHILD_AVATARS.length], pin: '' }]);
    }
  };

  const updateChild = (i: number, k: keyof ChildInput, v: string) => {
    setChildren(c => c.map((ch, idx) => idx === i ? { ...ch, [k]: v } : ch));
  };

  const handleFinish = () => {
    navigate('/parent');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dots = [1, 2, 3];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl shadow-purple-100 w-full max-w-sm">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {dots.map(d => (
            <div
              key={d}
              className={`rounded-full transition-all duration-300 ${d === step ? 'w-8 h-2.5 bg-purple-600' : d < step ? 'w-2.5 h-2.5 bg-purple-300' : 'w-2.5 h-2.5 bg-gray-200'}`}
            />
          ))}
        </div>

        <div className="p-6">
          {/* Step 1: Family name & avatar */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center">
                <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
                <h2 className="text-xl font-black text-gray-900">Bienvenue ! Créons votre famille</h2>
                <p className="text-gray-500 text-sm mt-1">Donnez un nom à votre famille</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Nom de la famille</label>
                <input
                  type="text"
                  value={familyName}
                  onChange={e => setFamilyName(e.target.value)}
                  placeholder="Famille Martin"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Votre avatar (parent)</label>
                <div className="flex flex-wrap gap-2">
                  {PARENT_AVATARS.map(a => (
                    <button
                      key={a}
                      onClick={() => setParentAvatar(a)}
                      className={`w-11 h-11 rounded-2xl text-2xl transition-all ${parentAvatar === a ? 'bg-purple-100 ring-2 ring-purple-500 scale-110' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="primary" fullWidth size="lg" onClick={() => setStep(2)} disabled={!familyName.trim()}>
                Continuer →
              </Button>
            </div>
          )}

          {/* Step 2: Add children */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center">
                <div className="text-4xl mb-2">👶</div>
                <h2 className="text-xl font-black text-gray-900">Ajoutez vos enfants</h2>
                <p className="text-gray-500 text-sm mt-1">Jusqu'à 4 enfants</p>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {children.map((child, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      {CHILD_AVATARS.map(a => (
                        <button
                          key={a}
                          onClick={() => updateChild(i, 'avatar', a)}
                          className={`w-8 h-8 rounded-xl text-lg transition-all ${child.avatar === a ? 'bg-purple-100 ring-2 ring-purple-400 scale-110' : 'bg-white'}`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={child.name}
                        onChange={e => updateChild(i, 'name', e.target.value)}
                        placeholder="Prénom"
                        className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
                      />
                      <input
                        type="number"
                        value={child.age}
                        onChange={e => updateChild(i, 'age', e.target.value)}
                        placeholder="Âge"
                        min="2"
                        max="18"
                        className="w-16 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      value={child.pin}
                      onChange={e => updateChild(i, 'pin', e.target.value.slice(0, 4))}
                      placeholder="Code PIN (4 chiffres)"
                      pattern="[0-9]{4}"
                      inputMode="numeric"
                      className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
                    />
                  </div>
                ))}
              </div>

              {children.length < 4 && (
                children.length >= 1 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-3">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Plusieurs enfants = Premium</p>
                      <p className="text-xs text-amber-600">Passez à TiPoche Premium pour ajouter jusqu'à 4 enfants</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={addChild}
                    className="w-full py-2.5 border-2 border-dashed border-gray-200 text-gray-500 rounded-2xl text-sm font-medium hover:border-purple-300 hover:text-purple-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Ajouter un enfant
                  </button>
                )
              )}

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} fullWidth>Retour</Button>
                <Button variant="primary" fullWidth
                  disabled={!children.some(c => c.name.trim())}
                  onClick={() => { createFamily({ familyName, parentAvatar, children }); setStep(3); }}>
                  Continuer →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Invite code */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in text-center">
              <div className="text-5xl">🎉</div>
              <h2 className="text-xl font-black text-gray-900">Votre famille est prête !</h2>
              <p className="text-gray-500 text-sm">Partagez ce code avec vos enfants pour qu'ils rejoignent la famille</p>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl p-5">
                <div className="text-sm text-purple-600 font-semibold mb-2">Code famille</div>
                <div className="text-4xl font-black text-purple-700 tracking-widest">{inviteCode}</div>
                <button
                  onClick={copyCode}
                  className="mt-3 flex items-center gap-2 mx-auto text-sm text-purple-500 hover:text-purple-700 font-medium"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copié !' : 'Copier le code'}
                </button>
              </div>

              <div className="bg-amber-50 rounded-2xl p-3 text-left">
                <div className="text-sm font-semibold text-amber-800 mb-1">📱 Comment ça marche ?</div>
                <div className="text-xs text-amber-700 space-y-1">
                  <div>1. L'enfant ouvre TiPoche</div>
                  <div>2. Il saisit le code famille : <strong>{inviteCode}</strong></div>
                  <div>3. Il crée son profil avec son PIN</div>
                </div>
              </div>

              <Button variant="primary" fullWidth size="lg" onClick={handleFinish}>
                Accéder au tableau de bord 🚀
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
