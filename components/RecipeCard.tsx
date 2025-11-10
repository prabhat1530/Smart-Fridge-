
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

const DifficultyBadge: React.FC<{ difficulty: 'Easy' | 'Medium' | 'Hard' }> = ({ difficulty }) => {
    const colorClasses = {
        Easy: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Hard: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[difficulty]}`}>
            {difficulty}
        </span>
    );
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  return (
    <div 
        onClick={() => onSelect(recipe)} 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
    >
      <div className="relative">
          <img src={`https://picsum.photos/seed/${recipe.recipeName}/400/200`} alt={recipe.recipeName} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300"></div>
           <div className="absolute top-3 right-3">
             <DifficultyBadge difficulty={recipe.difficulty} />
          </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 truncate">{recipe.recipeName}</h3>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
            <div className="flex items-center space-x-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <span>{recipe.prepTime}</span>
            </div>
             <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <span>{recipe.calories}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
