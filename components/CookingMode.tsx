
import React, { useState } from 'react';
import { Recipe } from '../types';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface CookingModeProps {
  recipe: Recipe;
  onExit: () => void;
  onAddToShoppingList: (items: string[]) => void;
}

const CookingMode: React.FC<CookingModeProps> = ({ recipe, onExit, onAddToShoppingList }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { speak, cancel, isSpeaking } = useTextToSpeech();

  const handleSpeak = () => {
    if (isSpeaking) {
      cancel();
    } else {
      const textToSpeak = `Step ${currentStep + 1}: ${recipe.steps[currentStep]}`;
      speak(textToSpeak);
    }
  };

  const handleNext = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      cancel();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      cancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      <header className="flex-shrink-0 bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{recipe.recipeName}</h1>
        <button onClick={() => { cancel(); onExit(); }} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-700"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </header>

      <div className="flex-grow overflow-y-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* Ingredients & Missing */}
        <div className="lg:w-1/3 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold border-b-2 border-indigo-500 pb-2 mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-indigo-600 font-bold mr-2">&#8226;</span>
                  <span className="text-gray-700">{ing.quantity} {ing.name}</span>
                </li>
              ))}
            </ul>
          </div>
          {recipe.missingIngredients.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Missing Ingredients</h3>
              <ul className="space-y-1 text-yellow-700">
                {recipe.missingIngredients.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <button
                onClick={() => onAddToShoppingList(recipe.missingIngredients)}
                className="mt-4 w-full px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Add to Shopping List
              </button>
            </div>
          )}
        </div>

        {/* Cooking Steps */}
        <div className="lg:w-2/3 flex flex-col justify-center items-center bg-white rounded-xl shadow-lg p-6 md:p-12">
            <div className="w-full text-center">
                <p className="text-sm font-medium text-indigo-600 mb-4">STEP {currentStep + 1} OF {recipe.steps.length}</p>
                <p className="text-2xl md:text-4xl lg:text-5xl font-serif text-gray-800 leading-snug">
                    {recipe.steps[currentStep]}
                </p>
            </div>
        </div>
      </div>

       <footer className="flex-shrink-0 bg-white border-t p-4 flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-0">
          <div className="flex items-center gap-4">
              <button onClick={handlePrev} disabled={currentStep === 0} className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
              <button onClick={handleNext} disabled={currentStep === recipe.steps.length - 1} className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
          <button onClick={handleSpeak} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-3 text-lg">
              {isSpeaking ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <span>Read Aloud</span>
                </>
              )}
          </button>
      </footer>
    </div>
  );
};

export default CookingMode;
