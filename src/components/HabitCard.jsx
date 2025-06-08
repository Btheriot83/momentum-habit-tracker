import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, Flame, Edit3, Trash2, MoreVertical } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

const iconMap = {
  target: '🎯',
  book: '📚',
  dumbbell: '💪',
  water: '💧',
  moon: '🌙',
  sun: '☀️',
  heart: '❤️',
  brain: '🧠',
  leaf: '🌱',
  fire: '🔥'
};

export default function HabitCard({ habit }) {
  const navigate = useNavigate();
  const { toggleCompletion, isCompleted, getStreakForHabit, deleteHabit } = useHabits();
  const [showMenu, setShowMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const completed = isCompleted(habit.id);
  const streak = getStreakForHabit(habit.id);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleCompletion(habit.id);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleEdit = () => {
    navigate(`/edit-habit/${habit.id}`);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habit.id);
    }
    setShowMenu(false);
  };

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 ${
      completed ? 'ring-2 ring-green-500 ring-opacity-50' : ''
    } ${isAnimating ? 'animate-bounce-gentle' : ''}`}>
      <div className="flex items-center space-x-4">
        {/* Completion Toggle */}
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 ${
            completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
          }`}
        >
          {completed ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400" />
          )}
        </button>

        {/* Habit Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">{iconMap[habit.icon] || '🎯'}</span>
            <h3 className={`font-semibold text-gray-900 dark:text-white truncate ${
              completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
            }`}>
              {habit.name}
            </h3>
          </div>
          
          {habit.intention && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {habit.intention}
            </p>
          )}

          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center space-x-1 mt-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                {streak} day{streak !== 1 ? 's' : ''} streak
              </span>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20">
                <button
                  onClick={handleEdit}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2 rounded-t-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}