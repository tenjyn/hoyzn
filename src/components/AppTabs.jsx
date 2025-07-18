import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Settings, ListChecks, Calendar as CalendarIcon, Trello, Home } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

const AppTabs = () => {
  const location = useLocation();
  
  let activeTab = 'dashboard';
  if (location.pathname.startsWith('/projects')) {
    const queryParams = new URLSearchParams(location.search);
    activeTab = queryParams.get('tab') || 'grid';
  } else if (location.pathname.startsWith('/task-board')) {
    activeTab = 'taskboard';
  } else if (location.pathname.startsWith('/settings')) {
    activeTab = 'settings';
  }

  return (
    <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-0 gap-4">
        <TabsList className="grid w-full grid-cols-4 sm:flex sm:w-auto">
          <TabsTrigger value="dashboard" asChild>
            <Link to="/dashboard">
              <Home className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="grid" asChild>
            <Link to="/projects?tab=grid">
                <LayoutGrid className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Projects</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="taskboard" asChild>
            <Link to="/task-board">
              <Trello className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Task Board</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="settings" asChild>
            <Link to="/settings">
              <Settings className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
};

export { AppTabs };