import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Star, Shield, Zap, Users, BarChart3, Smartphone, ChevronDown, ChevronUp, Vault } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { PricingModal } from '../components/Premium/PricingModal';

const features = [
  { icon: CheckCircle, title: 'Gestion des tâches', description: 'Créez et assignez des tâches à chaque enfant avec récompenses personnalisées', color: 'text-emerald-500', bg: 'bg-emerald-100' },
  { icon: Star, title: 'Gamification complète', description: 'Niveaux, XP, badges et streaks pour motiver les enfants chaque jour', color: 'text-amber-500', bg: 'bg-amber-100' },
  { icon: Shield, title: 'Tirelire virtuelle', description: 'Chaque tâche validée crédite la cagnotte CHF de l\'enfant automatiquement', color: 'text-blue-500', bg: 'bg-blue-100' },
  { icon: Zap, title: 'Validation parentale', description: 'Approuvez les tâches et retraits en un clic depuis votre tableau de bord', color: 'text-purple-500', bg: 'bg-purple-100' },
  { icon: Users, title: 'Toute la famille', description: 'Jusqu\'à 4 enfants par famille avec profils et progressions individuels', color: 'text-pink-500', bg: 'bg-pink-100' },
  { icon: BarChart3, title: 'Statistiques', description: 'Suivez les progrès et habitudes de chaque enfant semaine après semaine', color: 'text-cyan-500', bg: 'bg-cyan-100' },
];

const steps = [
  { step: '1', title: 'Créez votre famille', description: 'Inscrivez-vous et ajoutez vos enfants avec leur avatar et code PIN secret', emoji: '👨‍👩‍👧‍👦' },
  { step: '2', title: 'Assignez des tâches', description: 'Choisissez parmi 30+ modèles ou créez vos propres tâches avec récompenses en CHF', emoji: '📋' },
  { step: '3', title: 'Regardez-les s\'épanouir', description: 'Les enfants complètent, accumulent de l\'XP et remplissent leur cagnotte', emoji: '🚀' },
];

const testimonials = [
  { name: 'Marie F.', city: 'Genève', text: 'Mes enfants se disputent pour faire les tâches ! Un miracle pour la maison.', stars: 5, avatar: '👩' },
  { name: 'Thomas B.', city: 'Lausanne', text: 'Le système de cagnotte CHF est parfait. Plus de "pourquoi je dois faire ça ?"', stars: 5, avatar: '👨' },
  { name: 'Sandrine M.', city: 'Berne', text: 'L\'interface enfant est adorable. Ma fille de 7 ans l\'utilise seule !', stars: 5, avatar: '👩‍🦱' },
];

const faqs = [
  { q: 'Est-ce gratuit ?', a: 'Oui ! Le plan gratuit inclut 1 famille, 5 tâches actives et les badges basiques. Le plan Premium (CHF 7.90/mois) débloque les fonctionnalités avancées.' },
  { q: 'Comment les enfants reçoivent leur argent ?', a: 'L\'app gère la cagnotte virtuelle. Quand l\'enfant demande un retrait, vous le validez dans l\'app et vous donnez l\'argent en Twint ou en espèces.' },
  { q: 'Puis-je avoir plusieurs enfants ?', a: 'Oui ! Jusqu\'à 4 enfants avec le plan gratuit. Chaque enfant a son propre profil, cagnotte et progression.' },
  { q: 'L\'app fonctionne sur mobile ?', a: 'Absolument ! FamilyVault est conçu mobile-first. Il fonctionne sur tous les smartphones et peut être installé comme une app native.' },
  { q: 'Mes données sont-elles sécurisées ?', a: 'Toutes les données sont stockées localement sur votre appareil. Nous ne partageons rien avec des tiers.' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [pricingOpen, setPricingOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-nunito">
      {/* Nav */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl flex items-center justify-center text-white">
              <Vault className="w-4 h-4" />
            </div>
            <span className="font-black text-lg text-gray-900">FamilyVault</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Connexion</Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>Essayer</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-20 px-4 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Smartphone className="w-4 h-4" />
            Disponible sur iOS & Android
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
            L'app qui rend les enfants <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">responsables</span>…<br />et les parents plus <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">zen</span> 😌
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
            Tâches gamifiées, tirelire virtuelle en CHF, badges et récompenses. La solution complète pour une famille harmonieuse.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={() => navigate('/signup')}>
              Essayer gratuitement 🚀
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
              Connexion démo
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-3">✓ Gratuit · ✓ Sans carte · ✓ Données locales</p>

          {/* App preview mockup */}
          <div className="mt-12 relative">
            <div className="bg-white rounded-3xl shadow-2xl shadow-purple-200 p-6 mx-auto max-w-sm text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-2xl">🧒</div>
                <div>
                  <div className="font-black text-gray-900">Salut Léa ! 🎉</div>
                  <div className="text-sm text-gray-500">Niveau 5 · Super Étoile ✨</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-3 text-white flex items-center gap-2 mb-3">
                <span className="text-xl">🔥</span>
                <span className="text-sm font-bold">12 jours d'affilée !</span>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-4 text-white mb-3">
                <div className="text-sm opacity-80">Ma cagnotte</div>
                <div className="text-3xl font-black">CHF 23.50</div>
              </div>
              <div className="space-y-2">
                {[
                  { emoji: '🛏️', title: 'Ranger sa chambre', reward: '+CHF 1.00', done: true },
                  { emoji: '📚', title: 'Faire ses devoirs', reward: '+CHF 1.50', done: false },
                ].map((task, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${task.done ? 'bg-emerald-50 opacity-60' : 'bg-gray-50'}`}>
                    <span className="text-lg">{task.emoji}</span>
                    <span className={`flex-1 text-sm font-semibold text-gray-800 ${task.done ? 'line-through' : ''}`}>{task.title}</span>
                    <span className="text-xs font-bold text-emerald-600">{task.reward}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Tout ce dont votre famille a besoin</h2>
            <p className="text-gray-500 text-lg">Une app complète, simple et amusante</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all">
                <div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-3`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Comment ça marche ?</h2>
            <p className="text-gray-500">Prêt en 5 minutes</p>
          </div>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-5 bg-white rounded-3xl p-5 shadow-sm">
                <div className="text-5xl shrink-0">{s.emoji}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-purple-600 text-white text-xs font-black rounded-full flex items-center justify-center">{s.step}</span>
                    <h3 className="font-bold text-gray-900">{s.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4" id="pricing">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Tarifs simples et transparents</h2>
            <p className="text-gray-500">Commencez gratuitement, évoluez quand vous êtes prêts</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Free */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.07)] border-2 border-gray-100">
              <div className="text-3xl mb-1">🆓</div>
              <h3 className="text-xl font-black text-gray-900">Gratuit</h3>
              <div className="text-3xl font-black text-gray-900 my-2">CHF 0</div>
              <p className="text-gray-500 text-sm mb-4">Pour commencer sans engagement</p>
              <div className="space-y-2 mb-5">
                {['1 famille, jusqu\'à 4 enfants', '5 tâches actives', 'Badges basiques', 'Tirelire virtuelle CHF', 'Calendrier familial', 'Liste de courses'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Button variant="secondary" fullWidth onClick={() => navigate('/signup')}>Commencer gratuitement</Button>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-6 shadow-xl shadow-purple-300 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 text-xs font-black px-2 py-1 rounded-full">POPULAIRE ⭐</div>
              <div className="text-3xl mb-1">👑</div>
              <h3 className="text-xl font-black text-white">Family Premium</h3>
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-3xl font-black text-white">CHF 7.90</span>
                <span className="text-purple-200">/mois</span>
              </div>
              <p className="text-purple-200 text-sm mb-1">ou CHF 79/an <span className="bg-white/20 px-1.5 rounded text-white font-bold">-15%</span></p>
              <div className="space-y-2 mb-5 mt-4">
                {['Tout du plan Gratuit +', 'Tâches illimitées', 'Badges premium exclusifs', 'Statistiques avancées', 'Thèmes personnalisés', 'Streak freeze 1x/semaine', 'Support prioritaire'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Button variant="secondary" fullWidth onClick={() => setPricingOpen(true)}>
                Payer avec Stripe 💳
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Ce qu'en disent les familles</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-700 text-sm mb-3 italic">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Questions fréquentes</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-50 pt-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-violet-600 to-purple-700 text-white text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-3xl font-black mb-4">Prêt à transformer votre famille ?</h2>
          <p className="text-purple-200 mb-8">Rejoignez les familles suisses qui utilisent FamilyVault chaque jour.</p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-white text-purple-700 hover:bg-gray-50"
          >
            Commencer gratuitement — c'est maintenant !
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl flex items-center justify-center text-white">
            <Vault className="w-4 h-4" />
          </div>
          <span className="font-black text-white">FamilyVault</span>
        </div>
        <p className="text-sm">© 2025 FamilyVault · Fait avec ❤️ en Suisse 🇨🇭</p>
        <p className="text-xs mt-1">Données stockées localement · Confidentialité garantie</p>
      </footer>

      <PricingModal isOpen={pricingOpen} onClose={() => setPricingOpen(false)} />
    </div>
  );
};
