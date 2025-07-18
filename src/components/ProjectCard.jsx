import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Edit, Trash2, TrendingUp, ExternalLink } from "lucide-react";
import { formatDate, getContrastColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const ProjectCard = ({ 
  project, 
  categories = [], 
  onEdit, 
  onDelete,
  onUpdateCompletion,
  isDetailView = false
}) => {
  const navigate = useNavigate();
  const category = categories.find(c => c.id === project.categoryId);
  const categoryColor = category?.color || "#3b82f6";
  const textColor = getContrastColor(categoryColor);

  const handleCompletionChange = (value) => {
    onUpdateCompletion(project.id, value[0]);
  };
  
  const displayEstimatedTime = project.timeRemaining ?? project.estimatedTime;

  const handleCardClick = (e) => {
    if (isDetailView) return; 
    // Prevent navigation if clicking on interactive elements like buttons or slider
    if (e.target.closest('button') || e.target.closest('[role="slider"]')) {
      return;
    }
    navigate(`/project/${project.id}`);
  };

  return (
    <motion.div
      className={`project-card flex flex-col justify-between ${!isDetailView ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
      onClick={handleCardClick}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <div className="flex space-x-1">
            {!isDetailView && (
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); navigate(`/project/${project.id}`);}}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(project.id);}}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {project.description && (
          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {category && (
            <span 
              className="category-pill"
              style={{ 
                backgroundColor: categoryColor,
                color: textColor
              }}
            >
              {category.name}
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <Label htmlFor={`completion-${project.id}`} className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1.5" />
              Completion
            </Label>
            <span>{project.completionPercentage || 0}%</span>
          </div>
          <Slider
            id={`completion-${project.id}`}
            value={[project.completionPercentage || 0]}
            max={100}
            step={1}
            onValueChange={handleCompletionChange}
            className="w-full"
            aria-label="Project completion percentage"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {project.dueDate && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(project.dueDate, 'MMM d, yyyy')}</span>
            </div>
          )}
          
          {(displayEstimatedTime !== null && displayEstimatedTime !== undefined) && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {typeof displayEstimatedTime === 'number' ? displayEstimatedTime.toFixed(1) : displayEstimatedTime} hours remaining
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export { ProjectCard };