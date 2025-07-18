import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const initialDayProfiles = [
  {
    id: 'work-day',
    name: 'Standard Work Day',
    color: '#4A90E2',
    tasks: [
      { id: uuidv4(), name: 'Sleep', hours: 8, isFixed: true, color: '#4A90E2' },
      { id: uuidv4(), name: 'Commute & Prep', hours: 2, isFixed: true, color: '#F5A623' },
      { id: uuidv4(), name: 'Work', hours: 8, isFixed: false, color: '#BD10E0' },
      { id: uuidv4(), name: 'Indulgence', hours: 2, isFixed: true, color: '#7ED321' },
    ]
  },
  {
    id: 'weekend-day',
    name: 'Weekend/Day Off',
    color: '#7ED321',
    tasks: [
        { id: uuidv4(), name: 'Sleep', hours: 9, isFixed: true, color: '#4A90E2' },
        { id: uuidv4(), name: 'Hobbies/Relaxation', hours: 6, isFixed: false, color: '#F8E71C' },
        { id: uuidv4(), name: 'Chores/Errands', hours: 3, isFixed: false, color: '#D0021B' },
    ]
  }
];

export function useDayProfiles() {
  const [profiles, setProfiles] = useLocalStorage('dayProfiles_v1', initialDayProfiles);
  return { profiles, setProfiles };
}