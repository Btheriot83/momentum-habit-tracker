import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HabitProvider } from './context/HabitContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';
import HabitForm from './components/HabitForm';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Navigation from './components/Navigation';

function App() {
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('momentum-onboarded');
    setIsFirstTime(!hasOnboarded);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('momentum-onboarded', 'true');
    setIsFirstTime(false);
  };

  if (isFirstTime) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <HabitProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 min-h-screen shadow-lg">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add-habit" element={<HabitForm />} />
                <Route path="/edit-habit/:id" element={<HabitForm />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
              <Navigation />
            </div>
          </div>
        </Router>
      </HabitProvider>
    </ThemeProvider>
  );
}

export default App;