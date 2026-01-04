
import React from 'react';
import { CategoryType } from '../types';

interface CategoryCardProps {
  type: CategoryType;
  count: number;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ type, count, onClick }) => {
  const getIcon = () => {
    switch(type) {
      case CategoryType.HEALTH: return '🍎';
      case CategoryType.REGULATIONS: return '📜';
      case CategoryType.GENERAL: return '🌍';
      case CategoryType.GAMES: return '🎲';
      default: return '📦';
    }
  };

  const getTheme = () => {
    switch(type) {
      case CategoryType.HEALTH: return 'from-emerald-600 to-teal-800';
      case CategoryType.REGULATIONS: return 'from-amber-600 to-orange-800';
      case CategoryType.GENERAL: return 'from-blue-600 to-indigo-800';
      case CategoryType.GAMES: return 'from-purple-600 to-pink-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  // Assign a random floating delay for varied movement
  const animationDelay = `${Math.random() * 2}s`;

  return (
    <button
      onClick={onClick}
      disabled={count === 0}
      style={{ animationDelay }}
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl animate-bounce-subtle
        ${count === 0 ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:shadow-amber-500/50'}
      `}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
      
      <div className={`absolute inset-0 bg-gradient-to-br ${getTheme()} opacity-90`}></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center text-white">
        <span className="text-6xl mb-4 group-hover:rotate-12 transition-transform duration-500">
          {getIcon()}
        </span>
        <h3 className="text-2xl font-bold mb-2 drop-shadow-md">{type}</h3>
        <p className="text-amber-100 font-medium">
          {count > 0 ? `${count} کارت باقی‌مانده` : 'کارت‌ها تمام شد!'}
        </p>
        
        {count > 0 && (
          <div className="mt-4 px-4 py-2 bg-white/20 rounded-full text-sm font-bold border border-white/30 backdrop-blur-sm group-hover:bg-white/40 transition-colors">
            برداشتن کارت
          </div>
        )}
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-white/10 -rotate-45 -translate-x-8 -translate-y-8"></div>
    </button>
  );
};

export default CategoryCard;
