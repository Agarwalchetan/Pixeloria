import React from 'react';

const Labs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Labs</h1>
          <p className="text-lg text-gray-600 mb-12">
            Explore our experimental tools and interactive demos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Lab items will be added here */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
            <p className="text-gray-600">
              Interactive labs and tools are being developed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labs;