import React from 'react';
import MainContent from './components/mainContent';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center"> {/* Subtle background gradient */}
      <MainContent />
    </div>
  );
};

export default App;
