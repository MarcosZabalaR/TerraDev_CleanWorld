import { useState } from 'react';
import { IconRecycle, IconBottle, IconPackage, IconGlass, IconTrash, IconDropletHalf2Filled, IconBolt, IconBuildingFactory2, IconShirt } from '@tabler/icons-react';

const categories = [
  { id: 'envases', icon: IconBottle, label: 'Envases', color: 'yellow' },
  { id: 'papel', icon: IconPackage, label: 'Papel y Cartón', color: 'cyan' },
  { id: 'vidrio', icon: IconGlass, label: 'Vidrio', color: 'emerald' },
  { id: 'restos', icon: IconTrash, label: 'Restos', color: 'gray' },
  { id: 'pilas', icon: IconBolt, label: 'Pilas', color: 'red' },
  { id: 'ropa', icon: IconShirt, label: 'Ropa', color: 'purple' },
  { id: 'aceite', icon: IconDropletHalf2Filled, label: 'Aceite', color: 'orange' },
  { id: 'industria', icon: IconBuildingFactory2, label: 'Industria', color: 'slate' },
];

const colorClasses = {
  yellow: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-600', hover: 'hover:bg-yellow-100' },
  cyan: { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-600', hover: 'hover:bg-cyan-100' },
  emerald: { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-600', hover: 'hover:bg-emerald-100' },
  gray: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-500', hover: 'hover:bg-gray-100' },
  red: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-600', hover: 'hover:bg-red-100' },
  purple: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-600', hover: 'hover:bg-purple-100' },
  orange: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-600', hover: 'hover:bg-orange-100' },
  slate: { bg: 'bg-slate-200', border: 'border-slate-300', text: 'text-slate-600', hover: 'hover:bg-slate-200' },
};

export default function RecyclingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const toggleCategory = (id) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  return (
    <div className="absolute bottom-6 right-6 z-1000">
      {isOpen && (
        <div className="absolute bottom-18 right-0 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-1 w-50">
          {categories.map((category) => {
			const isSelected = selected.includes(category.id);
			const colors = colorClasses[category.color];
			const Icon = category.icon;
			
			return (
				<button
				key={category.id}
				onClick={() => toggleCategory(category.id)}
				className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer border-2
					${isSelected 
					? `${colors.bg} ${colors.border}` 
					: `border-transparent ${colors.hover}`
					}`}
				>
				<Icon size={20} className={colors.text} />
				<span>{category.label}</span>
				</button>
			);
			})}
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-15 h-15 rounded-full bg-emerald-600 text-white shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-all cursor-pointer ${isOpen ? 'rotate-360' : ''}`}
      >
        <IconRecycle size={28} />
      </button>
    </div>
  );
}