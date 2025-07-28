import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '@/pages/DashboardPage';
import MainPage from '@/pages/MainPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import TaskBoardPage from '@/pages/TaskBoardPage';
import SettingsPage from '@/pages/SettingsPage';

const AppRoutes = ({ projectHookData, categoryHookData, calendarHookData }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route 
        path="projects" 
        element={
          <MainPage 
            projectHookData={projectHookData}
            categoryHookData={categoryHookData}
            calendarHookData={calendarHookData}
          />
        } 
      />
      <Route path="task-board" element={<TaskBoardPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route 
        path="/project/:projectId" 
        element={
          <ProjectDetailPage />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
