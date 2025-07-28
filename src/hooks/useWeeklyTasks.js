import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const initialWeeklyTasks = [
  { id: uuidv4(), name: 'Groceries & Errands', hours: 3, isFixed: false, color: '#BD10E0' },
  { id: uuidv4(), name: 'Workout/Exercise', hours: 5, isFixed: false, color: '#4A90E2' },
  { id: uuidv4(), name: 'Social Activities', hours: 6, isFixed: false, color: '#F5A623' },
];

export function useWeeklyTasks() {
  const [weeklyTasks, setWeeklyTasks] = useLocalStorage('weeklyRecurringTasks_v2', initialWeeklyTasks);
  return { weeklyTasks, setWeeklyTasks };
}
