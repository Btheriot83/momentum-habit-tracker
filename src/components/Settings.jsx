import React from 'react';
import { Moon, Sun, Smartphone, Info, Heart, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();

  const settingsGroups = [
    {
      title: 'Appearance',
      items: [
        {
          icon: isDark ? Sun : Moon,
          label: 'Theme',
          description: isDark ? 'Switch to light mode' : 'Switch to dark mode',
          action: toggleTheme,
          type: 'toggle'
        }
      ]
    },
    {
      title: 'About',
      items: [
        {
          icon: Info,
          label: 'Version',
          description: '1.0.0',
          type: 'info'
        },
        {
          icon: Heart,
          label: 'Made with',
          description: 'React, Tailwind CSS, and lots of ❤️',
          type: 'info'
        },
        {
          icon: Star,
          label: 'Feedback',
          description: 'Help us improve Momentum',
          action: () => alert('Thank you for your interest! Feedback feature coming soon.'),
          type: 'action'
        }
      ]
    }
  ];

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Customize your Momentum experience
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {group.title}
              </h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div
                    key={itemIndex}
                    className={`px-6 py-4 flex items-center space-x-4 ${
                      item.type === 'toggle' || item.type === 'action'
                        ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'
                        : ''
                    }`}
                    onClick={item.action}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {item.description}
                      </p>
                    </div>
                    {item.type === 'toggle' && (
                      <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        isDark ? 'bg-blue-500' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 transform translate-y-0.5 ${
                          isDark ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Momentum
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs mx-auto">
            Achieve your goals, effortlessly. Build lasting habits that transform your life.
          </p>
        </div>
      </div>
    </div>
  );
}