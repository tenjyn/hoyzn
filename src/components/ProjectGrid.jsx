import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ProjectGrid = ({
  projects,
  categories,
  onEditProject,
  onDeleteProject,
  onAddProject,
  onUpdateProjectCompletion
}) => {
  return (
    <div className="space-y-6">
      <AnimatePresence>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                categories={categories}
                onEdit={onEditProject}
                onDelete={onDeleteProject}
                onUpdateCompletion={onUpdateProjectCompletion}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="glassmorphism mx-auto max-w-md p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first project to get started tracking your work.
              </p>
              <Button onClick={onAddProject}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { ProjectGrid };
