import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Target, Flame } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { useHabits } from '../context/HabitContext';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

export default function Analytics() {
  const { habits, getCompletionRate, getStreakForHabit, isCompleted } = useHabits();
  const [timeRange, setTimeRange] = useState(7); // 7, 30, or 90 days

  // Calculate completion data for the chart
  const getCompletionData = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, timeRange - 1);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const dayStr = format(day, 'MMM dd');
      const completed = habits.filter(habit => isCompleted(habit.id, day)).length;
      const total = habits.filter(habit => {
        const dayOfWeek = day.getDay();
        return habit.frequency === 'daily' || 
               (habit.frequency === 'weekly' && habit.days?.includes(dayOfWeek));
      }).length;
      
      return {
        date: dayStr,
        completed,
        total,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    });
  };

  // Calculate habit performance data
  const getHabitPerformance = () => {
    return habits.map((habit, index) => ({
      name: habit.name,
      rate: getCompletionRate(habit.id, timeRange),
      streak: getStreakForHabit(habit.id),
      color: COLORS[index % COLORS.length]
    })).sort((a, b) => b.rate - a.rate);
  };

  const completionData = getCompletionData();
  const habitPerformance = getHabitPerformance();
  
  const totalHabits = habits.length;
  const avgCompletionRate = habitPerformance.length > 0 
    ? Math.round(habitPerformance.reduce((sum, h) => sum + h.rate, 0) / habitPerformance.length)
    : 0;
  const longestStreak = Math.max(...habitPerformance.map(h => h.streak), 0);
  const activeHabits = habitPerformance.filter(h => h.rate > 0).length;

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analytics</h1>
          
          {/* Time Range Selector */}
          <div className="flex space-x-2">
            {[7, 30, 90].map(days => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  timeRange === days
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Habits</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalHabits}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Rate</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{avgCompletionRate}%</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Best Streak</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{longestStreak}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{activeHabits}</div>
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No data yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Start tracking habits to see your analytics
            </p>
          </div>
        ) : (
          <>
            {/* Completion Rate Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Daily Completion Rate
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completionData}>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      domain={[0, 100]}
                    />
                    <Bar 
                      dataKey="rate" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Habit Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Habit Performance
              </h3>
              <div className="space-y-4">
                {habitPerformance.map((habit, index) => (
                  <div key={habit.name} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {habit.name}
                        </span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {habit.rate}%
                          </span>
                          {habit.streak > 0 && (
                            <div className="flex items-center space-x-1">
                              <Flame className="w-3 h-3 text-orange-500" />
                              <span className="text-xs text-orange-600 dark:text-orange-400">
                                {habit.streak}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${habit.rate}%`,
                            backgroundColor: habit.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Habit Distribution */}
            {habitPerformance.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Completion Distribution
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={habitPerformance}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="rate"
                        label={({ name, rate }) => `${name}: ${rate}%`}
                        labelLine={false}
                      >
                        {habitPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}