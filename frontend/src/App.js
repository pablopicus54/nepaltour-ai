import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-blue-600">NepalTourAI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Intelligent Personalized Tourism Recommendation System for Nepal
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Project Status
            </h2>
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Backend API Structure Created</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>React Frontend Initialized</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Tailwind CSS Configured</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">○</span>
                <span>Database Setup - In Progress</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">○</span>
                <span>ML Engine - Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
