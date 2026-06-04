import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const FAQ_RESPONSES: Record<string, string> = {
  prix: "TiPoche est **gratuit** pour 1 enfant ! 🎉\n\nLa version **Premium à CHF 4.90/mois** vous donne :\n• Jusqu'à 4 enfants\n• Tâches illimitées\n• Badges premium\n• Sync Google Calendar & Outlook\n• Statistiques avancées",

  gratuit: "Oui, TiPoche est **100% gratuit** pour commencer !\n\nAvec la version gratuite vous avez :\n• 1 enfant\n• 5 tâches actives\n• Badges basiques\n• Cagnotte CHF\n\nUpgrade à CHF 4.90/mois quand vous êtes prêt 😊",

  argent: "L'argent dans TiPoche est **virtuel** (en CHF). Voici comment ça marche :\n\n1️⃣ L'enfant complète une tâche\n2️⃣ Le parent valide\n3️⃣ L'argent s'ajoute à la cagnotte\n4️⃣ L'enfant demande un retrait\n5️⃣ Vous payez en espèces, Twint ou virement\n\nTiPoche n'est pas une banque — c'est un outil éducatif 🏦",

  paiement: "Pour retirer de l'argent :\n\n1. L'enfant clique **'Demander un retrait'**\n2. Vous recevez une notification\n3. Vous approuvez dans l'app\n4. Vous remettez l'argent en **Twint, cash ou virement**\n\nSimple et transparent ! 💸",

  tache: "Créer une tâche est super simple :\n\n1. Allez dans **Tâches** (espace parent)\n2. Cliquez sur **+ Ajouter**\n3. Choisissez un modèle ou créez la vôtre\n4. Définissez la récompense (CHF + badges)\n5. Assignez à un enfant\n\nL'enfant reçoit la tâche instantanément ! ✅",

  badge: "Les badges récompensent les enfants pour leurs efforts ! 🏆\n\nIl y a **50+ badges** organisés par rareté :\n• 🟢 Commun\n• 🔵 Rare\n• 🟣 Épique\n• 🟡 Légendaire\n\nLes enfants adorent les collectionner — ça les motive énormément !",

  pieces: "Les **pièces d'or 🪙** s'ajoutent à chaque tâche validée.\n\nLes enfants les dépensent dans la **Boutique de récompenses** :\n• 🎮 1h de jeux vidéo = 50 pièces\n• 🎬 Choisir le film = 30 pièces\n• 🌴 Pas de tâches samedi = 120 pièces\n\nVous définissez les récompenses vous-même !",

  calendrier: "Le calendrier familial permet :\n\n📅 Voir tous les événements en famille\n🔗 Exporter vers **Google Calendar** et **Outlook**\n👶 Vue simplifiée pour les enfants\n\nLa sync bidirectionnelle Google/Outlook arrive bientôt !",

  securite: "La sécurité de vos données est notre priorité :\n\n🔒 Aucun réseau social\n📍 Pas de géolocalisation\n🇨🇭 Conformité GDPR & LPD Suisse\n💾 Données stockées de manière sécurisée\n🚫 Aucun partage avec des tiers",

  enfant: "Pour ajouter un enfant :\n\n1. Espace parent → **Enfants**\n2. Cliquez **Ajouter un enfant**\n3. Entrez prénom, âge, avatar et PIN\n4. L'enfant se connecte avec son PIN\n\n⭐ **Version gratuite** : 1 enfant\n💎 **Premium** : jusqu'à 4 enfants",

  stripe: "Les paiements Premium sont gérés par **Stripe** 🔐\n\nStripe est le système de paiement utilisé par Shopify, Amazon et des millions d'entreprises.\n\n✅ Paiement sécurisé\n✅ Carte bancaire, Apple Pay, Google Pay\n✅ Annulable à tout moment\n✅ Aucun engagement",

  default: "Bonjour ! Je suis l'assistant TiPoche 🐷\n\nJe peux vous renseigner sur :\n• 💰 **Prix et abonnements**\n• ✅ **Comment créer des tâches**\n• 🪙 **Système de pièces et boutique**\n• 🔒 **Sécurité et confidentialité**\n• 👶 **Gestion des enfants**\n\nQue voulez-vous savoir ?",
};

const findResponse = (input: string): string => {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (key === 'default') continue;
    if (lower.includes(key)) return response;
  }
  if (lower.includes('cout') || lower.includes('coût') || lower.includes('abonnement') || lower.includes('premium')) return FAQ_RESPONSES.prix;
  if (lower.includes('retrait') || lower.includes('twint') || lower.includes('cash')) return FAQ_RESPONSES.paiement;
  if (lower.includes('tâche') || lower.includes('corvee') || lower.includes('corvée')) return FAQ_RESPONSES.tache;
  if (lower.includes('sécur') || lower.includes('privé') || lower.includes('données')) return FAQ_RESPONSES.securite;
  return FAQ_RESPONSES.default;
};

const formatMessage = (text: string) => {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
};

export const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: FAQ_RESPONSES.default,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const text = input.trim();
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = findResponse(text);
      setTyping(false);
      setMessages(m => [...m, { id: (Date.now() + 1).toString(), role: 'assistant', text: response, timestamp: new Date() }]);
    }, 800 + Math.random() * 400);
  };

  const handleQuickQuestion = (q: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: q, timestamp: new Date() };
    setMessages(m => [...m, userMsg]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id: (Date.now() + 1).toString(), role: 'assistant', text: findResponse(q), timestamp: new Date() }]);
    }, 800);
  };

  const quickQuestions = ['Quel est le prix ?', 'Comment ça marche ?', "C'est sécurisé ?", "Comment retirer l'argent ?"];

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl shadow-2xl shadow-purple-400/40 flex items-center justify-center text-white hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-3xl shadow-2xl shadow-purple-200/50 flex flex-col overflow-hidden border border-purple-100"
          style={{ height: '480px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-xl">🐷</div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Assistant TiPoche</p>
              <p className="text-purple-200 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                En ligne
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100'
                  }`}
                >
                  {formatMessage(msg.text)}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100 flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions — shown only when there's just the initial message */}
          {messages.length <= 1 && (
            <div className="px-3 py-2 flex flex-wrap gap-1.5 bg-gray-50 border-t border-gray-100">
              {quickQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs bg-white border border-purple-200 text-purple-700 rounded-xl px-2.5 py-1 hover:bg-purple-50 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Posez votre question..."
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-9 h-9 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center text-white disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
