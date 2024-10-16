import React from 'react';
import MainContent from './components/mainContent';
import SignUp from './components/signUp';
import WelcomePage from './components/welcomePage';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

const App = () => {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center"> {/* Subtle background gradient */}
    //   <MainContent />
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/chat" element={<MainContent/>} />
      </Routes>
    </Router>
  );
};

export default App;
