import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Target } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

const iconOptions = [
  { key: 'target', emoji: '🎯', label: 'Goal' },
  { key: 'book', emoji: '📚', label: 'Reading' },
  { key: 'dumbbell', emoji: '💪', label: 'Exercise' },
  { key: 'water', emoji: '💧', label: 'Hydration' },
  { key: 'moon', emoji: '🌙', label: 'Sleep' },
  { key: 'sun', emoji: '☀️', label: 'Morning' },
  { key: 'heart', emoji: '❤️', label: 'Health' },
  { key: 'brain', emoji: '🧠', label: 'Learning' },
  { key: 'leaf', emoji: '🌱', label: 'Growth' },
  { key: 'fire', emoji: '🔥', label: 'Passion' }
];

const colorOptions = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-orange-500'
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HabitForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addHabit, updateHabit, habits } = useHabits();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    intention: '',
    frequency: 'daily',
    days: [],
    icon: 'target',
    color: 'bg-blue-500',
    createdAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const habit = habits.find(h => h.id === id);
      if (habit) {
        setFormData(habit);
      }
    }
  }, [id, habits, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    }

    if (formData.frequency === 'weekly' && formData.days.length === 0) {
      newErrors.days = 'Please select at least one day';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const habitData = {
      ...formData,
      name: formData.name.trim(),
      intention: formData.intention.trim()
    };

    if (isEditing) {
      updateHabit(habitData);
    } else {
      addHabit(habitData);
    }

    navigate('/');
  };

  const handleDayToggle = (dayIndex) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(dayIndex)
        ? prev.days.filter(d => d !== dayIndex)
        : [...prev.days, dayIndex]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Habit' : 'New Habit'}
          </h1>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Habit Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Habit Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Morning Exercise"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.name 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } focus:ring-2 focus:ring-opacity-50 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Intention */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Why does this matter to you?
          </label>
          <textarea
            value={formData.intention}
            onChange={(e) => setFormData(prev => ({ ...prev, intention: e.target.value }))}
            placeholder="e.g., To feel energized and healthy throughout the day"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200 resize-none"
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Frequency
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, frequency: 'daily', days: [] }))}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                formData.frequency === 'daily'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">📅</div>
                <div className="font-medium">Daily</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Every day</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, frequency: 'weekly' }))}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                formData.frequency === 'weekly'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">📊</div>
                <div className="font-medium">Weekly</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Specific days</div>
              </div>
            </button>
          </div>
        </div>

        {/* Days Selection (for weekly habits) */}
        {formData.frequency === 'weekly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Days *
            </label>
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDayToggle(index)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData.days.includes(index)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {errors.days && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.days}</p>
            )}
          </div>
        )}

        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose an Icon
          </label>
          <div className="grid grid-cols-5 gap-3">
            {iconOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, icon: option.key }))}
                className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                  formData.icon === option.key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{option.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose a Color
          </label>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color }))}
                className={`w-10 h-10 rounded-full ${color} transition-all duration-200 hover:scale-110 ${
                  formData.color === color ? 'ring-4 ring-gray-300 dark:ring-gray-600' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}