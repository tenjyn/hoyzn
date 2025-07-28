import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import AppContext from '@/AppContext';
import { AppHeader } from "@/components/AppHeader";
import { AppTabs } from "@/components/AppTabs";
import { AppModals } from "@/components/AppModals";
import { Toaster } from "@/components/ui/toaster";
import AppRoutes from "@/AppRoutes";

const AppCore = () => {
  const { 
    projectHookData, 
    categoryHookData, 
    calendarHookData 
  } = useContext(AppContext);

  const location = useLocation();
  
  let activeTab = 'dashboard';
  if (location.pathname.startsWith('/projects')) {
    const queryParams = new URLSearchParams(location.search);
    activeTab = queryParams.get('tab') || 'grid';
  } else if (location.pathname.startsWith('/task-board')) {
    activeTab = 'taskboard';
  }

  const isProjectDetailPage = location.pathname.startsWith('/project/');
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isProjectDetailPage && <AppHeader onAddProject={projectHookData.handleAddProject} />}
      
      <main className="container mx-auto px-4 py-8">
        {!isProjectDetailPage && <AppTabs initialTab={activeTab} />}
        <div className={!isProjectDetailPage ? "mt-8" : ""}>
            <AppRoutes 
                projectHookData={projectHookData}
                categoryHookData={categoryHookData}
                calendarHookData={calendarHookData}
            />
        </div>
      </main>
      
      <AppModals
        projectHookData={projectHookData}
        categoryHookData={categoryHookData}
        calendarHookData={calendarHookData}
      />
      
      <Toaster />
    </div>
  );
};

export default AppCore;
