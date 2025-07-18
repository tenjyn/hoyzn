import { useLocalStorage } from '@/hooks/useLocalStorage';

export function useDayClassifications() {
  const [dayClassifications, setDayClassifications] = useLocalStorage('dayClassifications_v1', {});
  return { dayClassifications, setDayClassifications };
}