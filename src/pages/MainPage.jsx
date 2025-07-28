import React from 'react';
import { useLocation } from 'react-router-dom';
import { ProjectGrid } from "@/components/ProjectGrid";
import { CategoryList } from "@/components/CategoryList";
import { UpcomingProjects } from "@/components/UpcomingProjects";
import { DayDetail } from "@/components/DayDetail";

const MainPage = ({ projectHookData, categoryHookData, calendarHookData }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'grid';

  const renderContent = () => {
    switch (activeTab) {
      case 'grid':
        return (
          <ProjectGrid
            projects={projectHookData.projects}
            onEditProject={projectHookData.handleEditProject}
            onDeleteProject={projectHookData.handleDeleteProject}
            onUpdateProjectCompletion={projectHookData.handleUpdateProjectCompletion}
          />
        );
      case 'categories':
        return (
          <CategoryList
            categories={categoryHookData.categories}
            onEditCategory={categoryHookData.handleEditCategory}
            onDeleteCategory={categoryHookData.handleDeleteCategory}
            onAddCategory={categoryHookData.handleAddCategory}
          />
        );
      case 'upcoming':
        return <UpcomingProjects projects={projectHookData.projects} />;
      case 'calendar':
        return (
          <DayDetail
            selectedDate={calendarHookData.selectedDate}
            projectsOnDate={calendarHookData.projectsOnDate}
            onClose={() => calendarHookData.handleSelectDate(null)}
          />
        );
      default:
        return <ProjectGrid projects={projectHookData.projects} />;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default MainPage;
