import React, { useState } from 'react';

export function useCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayProjects, setSelectedDayProjects] = useState([]);

  const handleSelectDate = (date, dayProjects) => {
    setSelectedDate(date);
    setSelectedDayProjects(dayProjects);
  };

  const handleCloseDayDetail = () => {
    setSelectedDate(null);
    setSelectedDayProjects([]);
  };

  return {
    selectedDate,
    selectedDayProjects,
    handleSelectDate,
    handleCloseDayDetail,
  };
}