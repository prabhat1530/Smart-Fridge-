
import React from 'react';

const dietaryOptions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Keto',
  'Low-Carb',
  'Dairy-Free',
];

interface SidebarProps {
  activeFilters: string[];
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

const Sidebar: React.FC<SidebarProps> = ({ activeFilters, setActiveFilters }) => {
  const handleFilterChange = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white md:border-r border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Dietary Filters</h2>
      <div className="space-y-3">
        {dietaryOptions.map(option => (
          <label key={option} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={activeFilters.includes(option)}
              onChange={() => handleFilterChange(option)}
              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
