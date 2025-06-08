import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { useHabits } from '../context/HabitContext';
import HabitCard from './HabitCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { getTodaysHabits, habits } = useHabits();
  const todaysHabits = getTodaysHabits();
  const today = format(new Date(), 'EEEE, MMMM d');

  const completedToday = todaysHabits.filter(habit => 
    useHabits().isCompleted(habit.id)
  ).length;

  const completionRate = todaysHabits.length > 0 
    ? Math.round((completedToday / todaysHabits.length) * 100)
    : 0;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Good morning!</h1>
            <p className="text-blue-100 text-sm">{today}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{completionRate}%</div>
            <div className="text-blue-100 text-sm">completed</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex space-x-4">
          <div className="bg-white/20 rounded-xl p-3 flex-1">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Today</span>
            </div>
            <div className="text-lg font-semibold">
              {completedToday}/{todaysHabits.length}
            </div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 flex-1">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4" />
              <span className="text-sm">Total Habits</span>
            </div>
            <div className="text-lg font-semibold">{habits.length}</div>
          </div>
        </div>
      </div>

      {/* Today's Habits */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Today's Habits
          </h2>
          <button
            onClick={() => navigate('/add-habit')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {todaysHabits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No habits for today
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start building your first habit to begin your journey
            </p>
            <button
              onClick={() => navigate('/add-habit')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todaysHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}

        {/* Motivational Message */}
        {todaysHabits.length > 0 && (
          <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              {completionRate === 100 
                ? "🎉 Amazing! You've completed all your habits today!"
                : completionRate >= 50
                ? "💪 Great progress! Keep up the momentum!"
                : "🌱 Every small step counts. You've got this!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}