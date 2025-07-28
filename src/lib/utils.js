import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, startOfDay, addDays, isWithinInterval, isSameDay } from 'date-fns';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function formatDate(date, formatString = 'PPP') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
}

export function getContrastColor(hexColor) {
  if (!hexColor) return '#ffffff';
  
  let r = 0, g = 0, b = 0;
  
  if (hexColor.length === 4) {
    r = parseInt(hexColor[1] + hexColor[1], 16);
    g = parseInt(hexColor[2] + hexColor[2], 16);
    b = parseInt(hexColor[3] + hexColor[3], 16);
  } 
  else if (hexColor.length === 7) {
    r = parseInt(hexColor.substring(1, 3), 16);
    g = parseInt(hexColor.substring(3, 5), 16);
    b = parseInt(hexColor.substring(5, 7), 16);
  }
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

export function getUpcomingProjects(projects) {
  const today = startOfDay(new Date());
  const nextSevenDaysEnd = addDays(today, 6); 

  return projects
    .filter(project => {
      if (!project.dueDate) return false;
      const dueDate = startOfDay(typeof project.dueDate === 'string' ? parseISO(project.dueDate) : project.dueDate);
      return isWithinInterval(dueDate, { start: today, end: nextSevenDaysEnd }) || isSameDay(dueDate, today);
    })
    .sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA - dateB;
    });
}
