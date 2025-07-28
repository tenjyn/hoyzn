import React, { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Square, Trash2, Edit, Edit2, Info, Calendar as CalendarIcon, AlertTriangle, Star, FileText, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeAllocationChart } from '@/components/TimeAllocationChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AppContext from '@/AppContext';
import { formatDate, getContrastColor } from "@/lib/utils";
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PriorityIndicator = ({ priority }) => {
  switch (priority) {
    case 'high': return <AlertTriangle className="h-4 w-4 text-red-500 inline-block" />;
    case 'medium': return <Star className="h-4 w-4 text-yellow-500 inline-block" />;
    case 'low': return <Layers className="h-4 w-4 text-green-500 inline-block" />;
    default: return null;
  }
};

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const {
    projectHookData,
    categoryHookData,
    dailyTasksHookData
  } = useContext(AppContext);

  const {
    projects,
    handleEditProject,
    handleDeleteProject,
    handleToggleSubTask,
  } = projectHookData;

  const { categories } = categoryHookData;
  const { dailyTasks } = dailyTasksHookData;
  const nonProjectWorkHours = dailyTasks.reduce((sum, task) => sum + task.hours, 0);
  const projectWorkHoursPerDay = Math.max(0.1, 24 - nonProjectWorkHours);
  const projectWorkHoursPerMonth = projectWorkHoursPerDay * 20;
  const projectWorkHoursPerYear = projectWorkHoursPerMonth * 12;


  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Project Not Found</h2>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Dashboard
        </Button>
      </div>
    );
  }

  const category = categories.find(c => c.id === project.categoryId);
  const categoryColor = category?.color || "#3b82f6";
  const textColor = getContrastColor(categoryColor);

  return (
    <TooltipProvider>
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
              <Edit className="h-4 w-4 mr-2" /> Edit Project
            </Button>
            <Button variant="destructive" size="sm" onClick={() => {
              handleDeleteProject(project.id);
              navigate('/');
            }}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Project
            </Button>
        </div>
      </div>

      <Card className="overflow-hidden shadow-xl neumorphism-strong">
         <div className="p-6">
            <div className="flex justify-between items-start mb-3">
                <h2 className="text-3xl font-bold flex items-center">
                    {project.title}
                    {project.priority && (
                        <Tooltip>
                            <TooltipTrigger asChild><span className="ml-2"><PriorityIndicator priority={project.priority} /></span></TooltipTrigger>
                            <TooltipContent><p>Priority: {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}</p></TooltipContent>
                        </Tooltip>
                    )}
                </h2>
                {category && (
                    <span
                    className="px-3 py-1 text-xs font-semibold rounded-full"
                    style={{
                        backgroundColor: categoryColor,
                        color: textColor
                    }}
                    >
                    {category.name}
                    </span>
                )}
            </div>
            {project.description && (
            <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{project.description}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                <div>
                    <Label className="text-xs text-muted-foreground">Due Date</Label>
                    <p className="flex items-center"><CalendarIcon className="h-3 w-3 mr-1.5"/>{project.dueDate ? formatDate(project.dueDate, 'MMM d, yyyy') : 'Not set'}</p>
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <p>{project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'To Do'}</p>
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">Est. Time</Label>
                    <p>{project.initialEstimatedTime ? `${project.initialEstimatedTime.toFixed(1)}h total` : 'N/A'}</p>
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">Time Remaining</Label>
                    <p>{project.timeRemaining !== null ? `${project.timeRemaining.toFixed(1)}h` : 'N/A'}</p>
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground">Completion</Label>
                    <p>{project.completionPercentage || 0}%</p>
                </div>
            </div>
         </div>
      </Card>

    {project.notes && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><FileText className="h-5 w-5 mr-2 text-primary" /> Notes</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.notes}</p>
            </CardContent>
        </Card>
    )}

      {project.subTasks && project.subTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sub-tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.subTasks.map(subTask => (
              <div key={subTask.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`detail-subtask-${subTask.id}`}
                  checked={subTask.completed}
                  onCheckedChange={() => handleToggleSubTask(project.id, subTask.id)}
                  aria-labelledby={`detail-subtask-label-${subTask.id}`}
                  className="mt-1"
                />
                <div className="flex-grow">
                  <Label
                    htmlFor={`detail-subtask-${subTask.id}`}
                    id={`detail-subtask-label-${subTask.id}`}
                    className={`font-medium text-sm cursor-pointer ${subTask.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {subTask.title}
                    {subTask.priority && <span className="ml-1.5"><PriorityIndicator priority={subTask.priority} /></span>}
                  </Label>
                  {subTask.description && (
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Info className="h-3 w-3 ml-1.5 text-muted-foreground inline-block cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-xs whitespace-pre-wrap">{subTask.description}</p>
                        </TooltipContent>
                      </Tooltip>
                  )}
                   {subTask.dueDate && (
                        <p className={`text-xs mt-0.5 text-muted-foreground ${subTask.completed ? 'line-through' : ''}`}>
                            <CalendarIcon className="h-3 w-3 mr-1 inline-block" /> Due: {format(new Date(subTask.dueDate), 'MMM d, yyyy')}
                        </p>
                    )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleEditProject(project)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <TimeAllocationChart
        project={project}
        dailyHours={projectWorkHoursPerDay}
        monthlyHours={projectWorkHoursPerMonth}
        yearlyHours={projectWorkHoursPerYear}
      />


      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><strong>ID:</strong> {project.id}</p>
          <p><strong>Created At:</strong> {project.createdAt ? new Date(project.createdAt).toLocaleString() : 'N/A'}</p>
           {category && <p><strong>Category Color:</strong> <span style={{color: category.color, fontWeight: 'bold'}}>{category.color}</span></p>}
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
};

export default ProjectDetailPage;
