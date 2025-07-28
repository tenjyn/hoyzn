import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const initialDailyTasks = [
  { id: uuidv4(), name: 'Sleep', hours: 8, isFixed: true, color: '#4A90E2' },
  { id: uuidv4(), name: 'Prep (Meals, Commute, etc.)', hours: 2, isFixed: true, color: '#F5A623' },
  { id: uuidv4(), name: 'Indulgence (Relax, Hobbies)', hours: 2, isFixed: true, color: '#7ED321' },
];

export function useDailyTasks() {
  const [dailyTasks, setDailyTasks] = useLocalStorage('dailyRecurringTasks_v2', initialDailyTasks);
  return { dailyTasks, setDailyTasks };
}
