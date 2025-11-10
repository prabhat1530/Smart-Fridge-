
import React, { useState, useCallback, useMemo } from 'react';
import { analyzeImageAndSuggestRecipes } from './services/geminiService';
import { Recipe } from './types';
import ImageUploader from './components/ImageUploader';
import RecipeList from './components/RecipeList';
import CookingMode from './components/CookingMode';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ShoppingList from './components/ShoppingList';

type ActiveTab = 'recipes' | 'shopping';

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('recipes');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setUploadedImage(base64Image);
      setIsLoading(true);
      setError(null);
      setRecipes([]);
      try {
        const generatedRecipes = await analyzeImageAndSuggestRecipes(base64Image, activeFilters);
        setRecipes(generatedRecipes);
      } catch (err) {
        setError('Could not generate recipes. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleExitCookingMode = useCallback(() => {
    setSelectedRecipe(null);
  }, []);

  const handleAddToShoppingList = useCallback((items: string[]) => {
    setShoppingList(prev => {
      const newItems = items.filter(item => !prev.includes(item));
      return [...prev, ...newItems];
    });
    setActiveTab('shopping');
  }, []);
  
  const handleClearShoppingList = useCallback(() => {
    setShoppingList([]);
  }, []);

  const filteredRecipes = useMemo(() => {
    if (activeFilters.length === 0) return recipes;
    // The Gemini API is already asked to filter, this is a client-side fallback/re-filter.
    return recipes.filter(recipe => 
      activeFilters.every(filter => 
        recipe.recipeName.toLowerCase().includes(filter.toLowerCase()) || 
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(filter.toLowerCase()))
      )
    );
  }, [recipes, activeFilters]);

  if (selectedRecipe) {
    return (
      <CookingMode
        recipe={selectedRecipe}
        onExit={handleExitCookingMode}
        onAddToShoppingList={handleAddToShoppingList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {!uploadedImage && <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />}
            
            {uploadedImage && (
              <div>
                <div className="flex justify-between items-center mb-6">
                   <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Suggested Recipes</h1>
                   <button 
                     onClick={() => setUploadedImage(null)}
                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                   >
                     New Photo
                   </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        <RecipeList 
                            recipes={filteredRecipes} 
                            onSelectRecipe={handleSelectRecipe} 
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                           <div className="flex border-b border-gray-200 mb-4">
                                <button onClick={() => setActiveTab('recipes')} className={`px-4 py-2 text-lg font-medium ${activeTab === 'recipes' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                                    Fridge
                                </button>
                                <button onClick={() => setActiveTab('shopping')} className={`px-4 py-2 text-lg font-medium ${activeTab === 'shopping' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                                    Shopping List ({shoppingList.length})
                                </button>
                            </div>

                            {activeTab === 'recipes' && (
                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold mb-3">Your Fridge</h2>
                                    <img src={uploadedImage} alt="Uploaded fridge contents" className="rounded-lg object-cover w-full h-auto" />
                                </div>
                            )}

                            {activeTab === 'shopping' && (
                               <ShoppingList list={shoppingList} onClear={handleClearShoppingList} />
                            )}
                        </div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
