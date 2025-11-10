
import React from 'react';

interface ShoppingListProps {
  list: string[];
  onClear: () => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ list, onClear }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Shopping List</h2>
        {list.length > 0 && (
          <button onClick={onClear} className="text-sm text-indigo-600 hover:text-indigo-800">
            Clear All
          </button>
        )}
      </div>
      {list.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Your shopping list is empty.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((item, index) => (
            <li key={index} className="flex items-center bg-gray-50 p-2 rounded">
              <input id={`item-${index}`} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3" />
              <label htmlFor={`item-${index}`} className="text-gray-700">{item}</label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShoppingList;
