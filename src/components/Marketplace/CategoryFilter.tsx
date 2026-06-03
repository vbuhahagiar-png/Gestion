import React from 'react';

const categories = [
  { id: 'all', label: 'Tout', emoji: '✨' },
  { id: 'Jouets', label: 'Jouets', emoji: '🧸' },
  { id: 'Livres', label: 'Livres', emoji: '📚' },
  { id: 'Jeux', label: 'Jeux', emoji: '🎲' },
  { id: 'Art & Créativité', label: 'Créativité', emoji: '🎨' },
  { id: 'Plein Air', label: 'Plein Air', emoji: '🌳' },
  { id: 'Technologie', label: 'Techno', emoji: '💻' },
  { id: 'Vêtements', label: 'Vêtements', emoji: '👕' },
  { id: 'Gourmandises', label: 'Bonbons', emoji: '🍬' },
];

interface CategoryFilterProps {
  selected: string;
  onSelect: (cat: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-nunito font-700 text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
            selected === cat.id
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-100'
          }`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
};
