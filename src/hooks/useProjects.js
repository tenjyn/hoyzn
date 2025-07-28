import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

export function useProjects() {
  const [projects, setProjects] = useLocalStorage("projects", []);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { toast } = useToast();

  const calculateTimeRemaining = (initialEstimatedTime, completionPercentage) => {
    if (initialEstimatedTime === null || initialEstimatedTime === undefined || completionPercentage === null || completionPercentage === undefined) {
      return null;
    }
    return initialEstimatedTime * (1 - (completionPercentage / 100));
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setProjectFormOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setProjectFormOpen(true);
  };

  const handleSaveProject = (projectData) => {
    const isNew = !projectData.id || !projects.some(p => p.id === projectData.id);

    let projectToSave = {
      ...projectData,
      subTasks: (projectData.subTasks || []).map(st => ({
        id: st.id || uuidv4(),
        title: st.title,
        description: st.description || "",
        completed: st.completed || false,
        priority: st.priority || 'medium',
        dueDate: st.dueDate || null,
      }))
    };

    if (projectToSave.estimatedTime !== null && projectToSave.estimatedTime !== undefined) {
      projectToSave.initialEstimatedTime = projectToSave.estimatedTime;
      projectToSave.timeRemaining = calculateTimeRemaining(projectToSave.initialEstimatedTime, projectToSave.completionPercentage);
    } else {
      projectToSave.initialEstimatedTime = null;
      projectToSave.timeRemaining = null;
    }

    projectToSave.completionPercentage = Number(projectToSave.completionPercentage) || 0;
    projectToSave.createdAt = projectToSave.createdAt || new Date().toISOString();
    projectToSave.priority = projectData.priority || 'medium';
    projectToSave.status = projectData.status || 'todo';
    projectToSave.notes = projectData.notes || "";


    if (isNew) {
      projectToSave.id = projectToSave.id || uuidv4();
      setProjects(prevProjects => [...prevProjects, projectToSave]);
      toast({
        title: "Project created",
        description: `${projectToSave.title} has been added successfully.`
      });
    } else {
      setProjects(prevProjects => prevProjects.map(p => {
        if (p.id === projectToSave.id) {
          let updatedProject = { ...p, ...projectToSave };
          if (projectData.estimatedTime !== p.initialEstimatedTime) {
             updatedProject.initialEstimatedTime = projectData.estimatedTime;
          }
          updatedProject.timeRemaining = calculateTimeRemaining(updatedProject.initialEstimatedTime, updatedProject.completionPercentage);
          return updatedProject;
        }
        return p;
      }));
      toast({
        title: "Project updated",
        description: `${projectToSave.title} has been updated successfully.`
      });
    }
    setProjectFormOpen(false);
  };

  const handleDeleteProject = (projectId) => {
    setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
    toast({
      title: "Project deleted",
      description: "The project has been removed successfully.",
      variant: "destructive"
    });
  };

  const handleUpdateProjectCompletion = (projectId, completionPercentage) => {
    setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === projectId) {
          const timeRemaining = calculateTimeRemaining(p.initialEstimatedTime, completionPercentage);
          return { ...p, completionPercentage, timeRemaining };
        }
        return p;
      })
    );
  };

  const handleToggleSubTask = (projectId, subTaskId) => {
    setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === projectId) {
          const updatedSubTasks = p.subTasks.map(st =>
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...p, subTasks: updatedSubTasks };
        }
        return p;
      })
    );
  };

  const handleUpdateSubTask = (projectId, subTaskData) => {
     setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === projectId) {
          const updatedSubTasks = p.subTasks.map(st =>
            st.id === subTaskData.id ? { ...st, ...subTaskData } : st
          );
          return { ...p, subTasks: updatedSubTasks };
        }
        return p;
      })
    );
  };


  return {
    projects,
    projectFormOpen,
    selectedProject,
    setProjectFormOpen,
    handleAddProject,
    handleEditProject,
    handleSaveProject,
    handleDeleteProject,
    handleUpdateProjectCompletion,
    handleToggleSubTask,
    handleUpdateSubTask
  };
}
