
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
             <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h14c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"/><path d="M9 4v16"/><path d="M15 4v16"/><path d="M5 10h14"/></svg>
            <h1 className="text-xl font-bold text-gray-900">
              Smart Fridge & Culinary Assistant
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
