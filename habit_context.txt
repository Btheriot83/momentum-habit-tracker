import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { format, isToday, startOfDay, differenceInDays } from 'date-fns';

const HabitContext = createContext();

const initialState = {
  habits: [],
  completions: {}, // { habitId: { 'YYYY-MM-DD': true/false } }
};

function habitReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload;
    
    case 'ADD_HABIT':
      return {
        ...state,
        habits: [...state.habits, { ...action.payload, id: Date.now().toString() }]
      };
    
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id ? action.payload : habit
        )
      };
    
    case 'DELETE_HABIT':
      const newCompletions = { ...state.completions };
      delete newCompletions[action.payload];
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
        completions: newCompletions
      };
    
    case 'TOGGLE_COMPLETION':
      const { habitId, date } = action.payload;
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        ...state,
        completions: {
          ...state.completions,
          [habitId]: {
            ...state.completions[habitId],
            [dateStr]: !state.completions[habitId]?.[dateStr]
          }
        }
      };
    
    default:
      return state;
  }
}

export function HabitProvider({ children }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('momentum-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        dispatch({ type: 'LOAD_DATA', payload: data });
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('momentum-data', JSON.stringify(state));
  }, [state]);

  const addHabit = (habit) => {
    dispatch({ type: 'ADD_HABIT', payload: habit });
  };

  const updateHabit = (habit) => {
    dispatch({ type: 'UPDATE_HABIT', payload: habit });
  };

  const deleteHabit = (habitId) => {
    dispatch({ type: 'DELETE_HABIT', payload: habitId });
  };

  const toggleCompletion = (habitId, date = new Date()) => {
    dispatch({ type: 'TOGGLE_COMPLETION', payload: { habitId, date } });
  };

  const isCompleted = (habitId, date = new Date()) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return state.completions[habitId]?.[dateStr] || false;
  };

  const getStreakForHabit = (habitId) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return 0;

    const today = startOfDay(new Date());
    let streak = 0;
    let currentDate = today;

    // Check if today is completed, if not, start from yesterday
    if (!isCompleted(habitId, today)) {
      currentDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    }

    // Count backwards to find the streak
    while (isCompleted(habitId, currentDate)) {
      streak++;
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    }

    return streak;
  };

  const getCompletionRate = (habitId, days = 30) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return 0;

    const today = startOfDay(new Date());
    const startDate = new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    
    let completed = 0;
    let total = 0;

    for (let i = 0; i < days; i++) {
      const checkDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      
      // Only count days since habit was created
      if (checkDate >= new Date(habit.createdAt)) {
        total++;
        if (isCompleted(habitId, checkDate)) {
          completed++;
        }
      }
    }

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getTodaysHabits = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    return state.habits.filter(habit => {
      if (habit.frequency === 'daily') return true;
      if (habit.frequency === 'weekly' && habit.days) {
        return habit.days.includes(dayOfWeek);
      }
      return false;
    });
  };

  const value = {
    habits: state.habits,
    completions: state.completions,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isCompleted,
    getStreakForHabit,
    getCompletionRate,
    getTodaysHabits,
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}