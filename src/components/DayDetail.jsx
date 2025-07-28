import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";

const DayDetail = ({
  date,
  projects = [],
  categories = [],
  onClose,
  onEditProject,
  onDeleteProject,
  onUpdateProjectCompletion
}) => {
  if (!date) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md bg-card rounded-lg shadow-lg border border-border overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold">
            {format(date, 'MMMM d, yyyy')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  categories={categories}
                  onEdit={onEditProject}
                  onDelete={onDeleteProject}
                  onUpdateCompletion={onUpdateProjectCompletion}
                  isDetailView={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No projects due on this day
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { DayDetail };
