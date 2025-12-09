import { useState } from 'react';
import { IconRecycle, IconBottle, IconPackage, IconGlass, IconTrash, IconDropletHalf2Filled, IconBolt, IconBuildingFactory2, IconShirt } from '@tabler/icons-react';

const categories = [
  { id: 'envases', icon: IconBottle, label: 'Envases', color: 'yellow' },
  { id: 'papel', icon: IconPackage, label: 'Papel y Cartón', color: 'blue' },
  { id: 'vidrio', icon: IconGlass, label: 'Vidrio', color: 'green' },
  { id: 'restos', icon: IconTrash, label: 'Restos', color: 'gray' },
  { id: 'pilas', icon: IconBolt, label: 'Pilas', color: 'gold' },
  { id: 'ropa', icon: IconShirt, label: 'Ropa', color: 'pink' },
  { id: 'aceite', icon: IconDropletHalf2Filled, label: 'Aceite', color: 'brown' },
  { id: 'industria', icon: IconBuildingFactory2, label: 'Punto Limpio', color: 'slate' },
];

const colorClasses = {
  yellow: { bg: 'bg-yellow-400/20', border: 'border-yellow-500', text: 'text-yellow-600', hover: 'hover:bg-yellow-400/10' },
  blue: { bg: 'bg-blue-400/20', border: 'border-blue-500', text: 'text-blue-600', hover: 'hover:bg-blue-400/10' },
  green: { bg: 'bg-emerald-400/20', border: 'border-emerald-600', text: 'text-emerald-600', hover: 'hover:bg-emerald-400/10' },
  gray: { bg: 'bg-stone-300/30', border: 'border-stone-500', text: 'text-stone-600', hover: 'hover:bg-stone-300/20' },
  gold: { bg: 'bg-amber-500/20', border: 'border-amber-600', text: 'text-amber-700', hover: 'hover:bg-amber-500/10' },
  pink: { bg: 'bg-pink-400/20', border: 'border-pink-500', text: 'text-pink-600', hover: 'hover:bg-pink-400/10' },
  brown: { bg: 'bg-brand-warm/20', border: 'border-brand-warm', text: 'text-brand-warm', hover: 'hover:bg-brand-warm/10' },
  slate: { bg: 'bg-brand-light/30', border: 'border-brand-primary', text: 'text-brand-primary', hover: 'hover:bg-brand-light/20' },
};

export default function RecyclingMenu({ selected, onToggleCategory, disabled = false }) {

  const toggleCategory = (id) => {
    if (disabled) return;
    if (selected.includes(id)) {
      onToggleCategory(selected.filter(item => item !== id));
    } else {
      onToggleCategory([...selected, id]);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-6 right-6 z-1000">
      {isOpen && (
        <div className="absolute bottom-18 right-0 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-1 w-50">
          {categories.map(category => {
            const isSelected = selected.includes(category.id);
            const Icon = category.icon;
            const colors = colorClasses[category.color];
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer border-2
                  ${isSelected ? `${colors.bg} ${colors.border}` : `border-transparent ${colors.hover}`}
                `}
              >
                <Icon size={20} className={colors.text} />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-15 h-15 rounded-full bg-brand-primary text-white shadow-lg flex items-center justify-center transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-dark cursor-pointer'}
          ${isOpen ? 'rotate-360' : ''}`}
      >
        <IconRecycle size={28} />
      </button>
    </div>
  );
}

