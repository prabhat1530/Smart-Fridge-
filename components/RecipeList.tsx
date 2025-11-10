
import React from 'react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  isLoading: boolean;
  error: string | null;
}

const SkeletonCard: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-300"></div>
        <div className="p-4">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
        </div>
    </div>
);


const RecipeList: React.FC<RecipeListProps> = ({ recipes, onSelectRecipe, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 px-4 bg-red-50 border-l-4 border-red-400">
        <p className="text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">No recipes found. Try a different photo or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recipes.map((recipe, index) => (
        <RecipeCard key={`${recipe.recipeName}-${index}`} recipe={recipe} onSelect={onSelectRecipe} />
      ))}
    </div>
  );
};

export default RecipeList;
