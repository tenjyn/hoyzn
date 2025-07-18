import React from "react";
import { AnimatePresence } from "framer-motion";
import { ProjectForm } from "@/components/ProjectForm";
import { CategoryForm } from "@/components/CategoryForm";
import { DayDetail } from "@/components/DayDetail";

const AppModals = ({ projectHookData, categoryHookData, calendarHookData }) => {
  const {
    projectFormOpen,
    selectedProject,
    setProjectFormOpen,
    handleEditProject,
    handleSaveProject,
    handleDeleteProject,
    handleUpdateProjectCompletion,
    handleToggleSubTask,
  } = projectHookData;

  const {
    categories,
    categoryFormOpen,
    selectedCategory,
    setCategoryFormOpen,
    handleSaveCategory,
  } = categoryHookData;

  const {
    selectedDate,
    selectedDayProjects,
    handleCloseDayDetail,
  } = calendarHookData;

  return (
    <>
      <ProjectForm
        open={projectFormOpen}
        onOpenChange={setProjectFormOpen}
        onSave={handleSaveProject}
        project={selectedProject}
        categories={categories}
      />
      
      <CategoryForm
        open={categoryFormOpen}
        onOpenChange={setCategoryFormOpen}
        onSave={handleSaveCategory}
        category={selectedCategory}
      />
      
      <AnimatePresence>
        {selectedDate && (
          <DayDetail
            date={selectedDate}
            projects={selectedDayProjects}
            categories={categories}
            onClose={handleCloseDayDetail}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            onUpdateProjectCompletion={handleUpdateProjectCompletion}
            onToggleSubTask={handleToggleSubTask}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export { AppModals };