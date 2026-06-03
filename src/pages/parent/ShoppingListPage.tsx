import React, { useState } from 'react';
import { Plus, Trash2, CheckSquare } from 'lucide-react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { useAuthStore } from '../../store/useAuthStore';
const EMOJI_OPTIONS = ['🛒', '🥛', '🍎', '🍞', '🥩', '🧀', '🥕', '🍝', '🥚', '🧴', '🍌', '🥦', '🍊', '🍫', '🧃', '🍚', '🫒', '🧅', '🍋', '🫐'];

export const ShoppingListPage: React.FC = () => {
  const { shoppingItems, addShoppingItem, toggleShoppingItem, deleteShoppingItem, clearCheckedItems } = useFamilyStore();
  const { currentUser, currentFamily } = useAuthStore();
  const [newItem, setNewItem] = useState('');
  const [newEmoji, setNewEmoji] = useState('🛒');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const unchecked = shoppingItems.filter(i => !i.checked);
  const checked = shoppingItems.filter(i => i.checked);

  const handleAdd = () => {
    if (!newItem.trim()) return;
    addShoppingItem({
      id: `sh-${Date.now()}`,
      familyId: currentFamily?.id || '',
      name: newItem.trim(),
      emoji: newEmoji,
      checked: false,
      addedBy: currentUser?.id || '',
      addedAt: new Date().toISOString(),
    });
    setNewItem('');
    setNewEmoji('🛒');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-gray-900">Liste de courses</h1>
        {checked.length > 0 && (
          <button
            onClick={clearCheckedItems}
            className="flex items-center gap-1 text-xs text-red-400 font-semibold hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5" /> Effacer cochés ({checked.length})
          </button>
        )}
      </div>

      {/* Add item */}
      <div className="bg-white rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
        <div className="flex gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-11 h-11 bg-gray-100 rounded-2xl flex items-center justify-center text-xl hover:bg-gray-200 transition-colors shrink-0"
          >
            {newEmoji}
          </button>
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Ajouter un article..."
            className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
          />
          <button
            onClick={handleAdd}
            disabled={!newItem.trim()}
            className="w-11 h-11 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl flex items-center justify-center hover:shadow-md transition-all disabled:opacity-50 shrink-0"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {showEmojiPicker && (
          <div className="mt-3 flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map(e => (
              <button
                key={e}
                onClick={() => { setNewEmoji(e); setShowEmojiPicker(false); }}
                className={`w-9 h-9 rounded-xl text-xl transition-all ${newEmoji === e ? 'bg-purple-100 ring-2 ring-purple-400' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-3 text-sm text-gray-500">
        <span className="font-semibold text-gray-900">{unchecked.length}</span> à acheter
        <span>•</span>
        <span className="font-semibold text-emerald-600">{checked.length}</span> cochés
      </div>

      {/* Unchecked items */}
      {unchecked.length > 0 && (
        <div className="space-y-2">
          {unchecked.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3"
            >
              <button
                onClick={() => toggleShoppingItem(item.id)}
                className="w-7 h-7 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-purple-400 transition-colors shrink-0"
              />
              <span className="text-xl">{item.emoji}</span>
              <span className="flex-1 font-medium text-gray-900 text-sm">{item.name}</span>
              <button
                onClick={() => deleteShoppingItem(item.id)}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Checked items */}
      {checked.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2">
            <CheckSquare className="w-3.5 h-3.5" /> Déjà dans le panier
          </div>
          <div className="space-y-2">
            {checked.map(item => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3 opacity-60"
              >
                <button
                  onClick={() => toggleShoppingItem(item.id)}
                  className="w-7 h-7 bg-emerald-500 border-2 border-emerald-500 rounded-lg flex items-center justify-center text-white shrink-0"
                >
                  <CheckSquare className="w-4 h-4" />
                </button>
                <span className="text-xl">{item.emoji}</span>
                <span className="flex-1 font-medium text-gray-500 text-sm line-through">{item.name}</span>
                <button
                  onClick={() => deleteShoppingItem(item.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {shoppingItems.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-3">🛒</div>
          <p className="text-gray-500 font-medium">La liste est vide</p>
          <p className="text-gray-400 text-sm">Ajoutez des articles ci-dessus</p>
        </div>
      )}
    </div>
  );
};
