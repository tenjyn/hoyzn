import React, { useContext, useState, useMemo } from 'react';
import AppContext from '@/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const TaskCard = ({ project, category, onDragStart }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.2 }}
    draggable
    onDragStart={(e) => onDragStart(e, project.id)}
    className="bg-card p-4 rounded-lg shadow-sm cursor-grab active:cursor-grabbing border border-border"
  >
    <div className="flex justify-between items-start mb-2">
      <Link to={`/project/${project.id}`}>
        <h4 className="font-semibold hover:text-primary transition-colors">{project.title}</h4>
      </Link>
      <div
        className="w-4 h-4 rounded-full shrink-0 mt-1"
        style={{ backgroundColor: category?.color || '#cccccc' }}
        title={category?.name || 'Uncategorized'}
      />
    </div>
    <p className="text-xs text-muted-foreground mb-3">{project.description.substring(0, 70)}{project.description.length > 70 ? '...' : ''}</p>
    {project.dueDate && <p className="text-xs font-medium">Due: {formatDate(project.dueDate, 'MMM d')}</p>}
  </motion.div>
);

const Column = ({ title, status, projects, categoryMap, onDragOver, onDrop, onDragStart }) => {
  const columnProjects = projects.filter(p => p.status === status);

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
      className="bg-background/50 rounded-lg p-4 w-full md:w-1/3 flex-shrink-0 border"
    >
      <h3 className="font-semibold mb-4 text-center">{title} ({columnProjects.length})</h3>
      <div className="space-y-3 h-full overflow-y-auto">
        <AnimatePresence>
          {columnProjects.map(project => (
            <TaskCard key={project.id} project={project} category={categoryMap[project.categoryId]} onDragStart={onDragStart} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TaskBoardPage = () => {
  const { projectHookData, categoryHookData } = useContext(AppContext);
  const { projects, handleAddProject, setProjects } = projectHookData;
  const { categories } = categoryHookData;
  const navigate = useNavigate();

  const categoryMap = useMemo(() => 
    categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {}),
  [categories]);

  const onDragStart = (e, projectId) => {
    e.dataTransfer.setData("projectId", projectId);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, newStatus) => {
    const projectId = e.dataTransfer.getData("projectId");
    setProjects(prevProjects => 
      prevProjects.map(p => 
        p.id === projectId ? { ...p, status: newStatus } : p
      )
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Board</h1>
        <div className="flex gap-2">
            <Button onClick={handleAddProject}><Plus className="mr-2 h-4 w-4" /> New Project</Button>
            <Button variant="outline" asChild><Link to="/projects"><Edit className="mr-2 h-4 w-4" />Manage Projects</Link></Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full overflow-x-auto pb-4">
        <Column 
          title="To Do" 
          status="todo" 
          projects={projects} 
          categoryMap={categoryMap} 
          onDragOver={onDragOver} 
          onDrop={onDrop}
          onDragStart={onDragStart}
        />
        <Column 
          title="In Progress" 
          status="inprogress" 
          projects={projects} 
          categoryMap={categoryMap} 
          onDragOver={onDragOver} 
          onDrop={onDrop}
          onDragStart={onDragStart}
        />
        <Column 
          title="Done" 
          status="done" 
          projects={projects} 
          categoryMap={categoryMap} 
          onDragOver={onDragOver} 
          onDrop={onDrop}
          onDragStart={onDragStart}
        />
      </div>
    </div>
  );
};

export default TaskBoardPage;