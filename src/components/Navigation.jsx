import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart3, Settings, Plus } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/add-habit', icon: Plus, label: 'Add', isSpecial: true },
  { path: '/settings', icon: Settings, label: 'Settings' }
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-200 ${
                item.isSpecial
                  ? 'bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-110 active:scale-95 shadow-lg'
                  : isActive
                  ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`w-6 h-6 ${item.isSpecial ? '' : isActive ? 'text-blue-500' : ''}`} />
              <span className={`text-xs font-medium ${
                item.isSpecial ? 'text-white' : isActive ? 'text-blue-500' : ''
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}