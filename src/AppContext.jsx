import React, { createContext, useEffect, useState, useMemo } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useCategories } from '@/hooks/useCategories';
import { useCalendar } from '@/hooks/useCalendar';
import { useWeeklyTasks } from '@/hooks/useWeeklyTasks';
import { useDayProfiles } from '@/hooks/useDayProfiles';
import { useDayClassifications } from '@/hooks/useDayClassifications';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const projectHookData = useProjects();
  const categoryHookData = useCategories(projectHookData.projects);
  const calendarHookData = useCalendar(projectHookData.projects);
  const weeklyTasksHookData = useWeeklyTasks();
  const dayProfilesHookData = useDayProfiles();
  const dayClassificationsHookData = useDayClassifications();

  return (
    <AppContext.Provider value={{
      projectHookData,
      categoryHookData,
      calendarHookData,
      weeklyTasksHookData,
      dayProfilesHookData,
      dayClassificationsHookData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
