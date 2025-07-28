import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PlusCircle, Trash2, Edit2, GripVertical, FileText } from "lucide-react";

const ProjectFormFields = ({ formData, handleChange, handleSelectChange, handleSliderChange, categories }) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="title">Title</Label>
      <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
    </div>

    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority || 'medium'} onValueChange={(value) => handleSelectChange("priority", value)}>
                <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status || 'todo'} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="categoryId">Category</Label>
      <Select value={formData.categoryId} onValueChange={(value) => handleSelectChange("categoryId", value)}>
        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estimatedTime">Total Estimated Time (hours)</Label>
        <Input id="estimatedTime" name="estimatedTime" type="number" min="0" step="0.5" value={formData.estimatedTime} onChange={handleChange} />
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="completionPercentage">Completion Percentage</Label>
        <span>{formData.completionPercentage}%</span>
      </div>
      <Slider id="completionPercentage" name="completionPercentage" value={[formData.completionPercentage]} onValueChange={handleSliderChange} max={100} step={1} />
    </div>

    <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea id="notes" name="notes" value={formData.notes || ""} onChange={handleChange} rows={3} placeholder="Any extra details, links, or reminders..."/>
    </div>
  </>
);

const SubTaskForm = ({
    newSubTaskTitle, setNewSubTaskTitle,
    newSubTaskDescription, setNewSubTaskDescription,
    newSubTaskPriority, setNewSubTaskPriority,
    newSubTaskDueDate, setNewSubTaskDueDate,
    handleAddOrUpdateSubTask,
    editingSubTask, setEditingSubTask,
    resetSubTaskFormFields
}) => (
  <div className="p-3 border rounded-md bg-muted/20 space-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
        <div className="space-y-1">
            <Label htmlFor="newSubTaskTitle">Sub-task Title</Label>
            <Input
              id="newSubTaskTitle" type="text" placeholder="Title for sub-task"
              value={newSubTaskTitle} onChange={(e) => setNewSubTaskTitle(e.target.value)}
            />
        </div>
        <div className="space-y-1">
            <Label htmlFor="newSubTaskPriority">Priority</Label>
            <Select value={newSubTaskPriority} onValueChange={setNewSubTaskPriority}>
                <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </div>
    <div className="space-y-1">
      <Label htmlFor="newSubTaskDescription">Sub-task Description</Label>
      <Textarea
        id="newSubTaskDescription" placeholder="Details for sub-task"
        value={newSubTaskDescription} onChange={(e) => setNewSubTaskDescription(e.target.value)}
        rows={2}
      />
    </div>
    <div className="space-y-1">
        <Label htmlFor="newSubTaskDueDate">Due Date (Optional)</Label>
        <Input
            id="newSubTaskDueDate" type="date"
            value={newSubTaskDueDate} onChange={(e) => setNewSubTaskDueDate(e.target.value)}
        />
    </div>
    <Button type="button" onClick={handleAddOrUpdateSubTask} className="w-full">
      {editingSubTask ? <><Edit2 className="h-4 w-4 mr-2" /> Update Sub-task</> : <><PlusCircle className="h-4 w-4 mr-2" /> Add Sub-task</>}
    </Button>
    {editingSubTask && (
      <Button type="button" variant="ghost" onClick={() => { setEditingSubTask(null); resetSubTaskFormFields(); }} className="w-full text-sm">
        Cancel Edit
      </Button>
    )}
  </div>
);

const SubTaskList = ({ subTasks, handleToggleSubTask, handleEditSubTask, handleDeleteSubTask }) => (
  subTasks && subTasks.length > 0 && (
    <div className="space-y-2 mt-3 max-h-48 overflow-y-auto pr-1">
      {subTasks.map(subTask => (
        <div key={subTask.id} className="flex items-start space-x-2 p-2 border rounded-md hover:bg-muted/50">
          <Checkbox
            id={`subtask-${subTask.id}`} checked={subTask.completed}
            onCheckedChange={() => handleToggleSubTask(subTask.id)}
            className="mt-1"
          />
          <div className="flex-grow">
            <label htmlFor={`subtask-${subTask.id}`} className={`font-medium text-sm ${subTask.completed ? 'line-through text-muted-foreground' : ''}`}>
              {subTask.title} <span className="text-xs text-muted-foreground">({subTask.priority || 'medium'})</span>
            </label>
            {subTask.description && (
              <p className={`text-xs text-muted-foreground ${subTask.completed ? 'line-through' : ''}`}>{subTask.description}</p>
            )}
            {subTask.dueDate && (
                <p className={`text-xs text-muted-foreground ${subTask.completed ? 'line-through' : ''}`}>Due: {format(new Date(subTask.dueDate), 'MMM d, yyyy')}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-1">
            <Button type="button" variant="outline" size="icon" onClick={() => handleEditSubTask(subTask)} className="h-7 w-7">
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteSubTask(subTask.id)} className="h-7 w-7">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
);


const ProjectForm = ({ open, onOpenChange, onSave, project = null, categories = [] }) => {
  const initialFormData = useCallback(() => ({
    id: "", title: "", description: "", categoryId: "", dueDate: "",
    estimatedTime: "", completionPercentage: 0, initialEstimatedTime: null,
    subTasks: [], priority: "medium", status: "todo", notes: ""
  }), []);

  const [formData, setFormData] = useState(initialFormData());
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
  const [newSubTaskDescription, setNewSubTaskDescription] = useState("");
  const [newSubTaskPriority, setNewSubTaskPriority] = useState("medium");
  const [newSubTaskDueDate, setNewSubTaskDueDate] = useState("");
  const [editingSubTask, setEditingSubTask] = useState(null);

  const resetSubTaskFormFields = useCallback(() => {
    setNewSubTaskTitle("");
    setNewSubTaskDescription("");
    setNewSubTaskPriority("medium");
    setNewSubTaskDueDate("");
  }, []);

  useEffect(() => {
    if (open) {
      if (project) {
        setFormData({
          id: project.id,
          title: project.title || "",
          description: project.description || "",
          categoryId: project.categoryId || "",
          dueDate: project.dueDate ? format(new Date(project.dueDate), 'yyyy-MM-dd') : "",
          estimatedTime: project.initialEstimatedTime !== undefined && project.initialEstimatedTime !== null ? project.initialEstimatedTime : (project.estimatedTime || ""),
          completionPercentage: project.completionPercentage || 0,
          initialEstimatedTime: project.initialEstimatedTime !== undefined && project.initialEstimatedTime !== null ? project.initialEstimatedTime : (project.estimatedTime || null),
          subTasks: (project.subTasks || []).map(st => ({ ...st, priority: st.priority || 'medium' })),
          priority: project.priority || 'medium',
          status: project.status || 'todo',
          notes: project.notes || "",
        });
      } else {
        setFormData({
          ...initialFormData(),
          id: uuidv4(),
          categoryId: categories.length > 0 ? categories[0].id : "",
        });
      }
      setEditingSubTask(null);
      resetSubTaskFormFields();
    }
  }, [project, categories, open, initialFormData, resetSubTaskFormFields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (value) => {
    setFormData(prev => ({ ...prev, completionPercentage: value[0] }));
  };

  const handleAddOrUpdateSubTask = () => {
    if (newSubTaskTitle.trim() === "") return;

    const subTaskData = {
        title: newSubTaskTitle.trim(),
        description: newSubTaskDescription.trim(),
        priority: newSubTaskPriority,
        dueDate: newSubTaskDueDate ? new Date(newSubTaskDueDate).toISOString() : null,
    };

    if (editingSubTask) {
      setFormData(prev => ({
        ...prev,
        subTasks: prev.subTasks.map(st =>
          st.id === editingSubTask.id ? { ...st, ...subTaskData } : st
        )
      }));
      setEditingSubTask(null);
    } else {
      setFormData(prev => ({
        ...prev,
        subTasks: [...prev.subTasks, { id: uuidv4(), ...subTaskData, completed: false }]
      }));
    }
    resetSubTaskFormFields();
  };

  const handleEditSubTask = (subTask) => {
    setEditingSubTask(subTask);
    setNewSubTaskTitle(subTask.title);
    setNewSubTaskDescription(subTask.description || "");
    setNewSubTaskPriority(subTask.priority || "medium");
    setNewSubTaskDueDate(subTask.dueDate ? format(new Date(subTask.dueDate), 'yyyy-MM-dd') : "");
  };

  const handleToggleSubTask = (subTaskId) => {
    setFormData(prev => ({
      ...prev,
      subTasks: prev.subTasks.map(st =>
        st.id === subTaskId ? { ...st, completed: !st.completed } : st
      )
    }));
  };

  const handleDeleteSubTask = (subTaskId) => {
    setFormData(prev => ({
      ...prev,
      subTasks: prev.subTasks.filter(st => st.id !== subTaskId)
    }));
    if (editingSubTask && editingSubTask.id === subTaskId) {
      setEditingSubTask(null);
      resetSubTaskFormFields();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalEstimatedTime = formData.estimatedTime ? Number(formData.estimatedTime) : null;
    const formattedData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      estimatedTime: totalEstimatedTime,
      initialEstimatedTime: formData.initialEstimatedTime !== null ? formData.initialEstimatedTime : totalEstimatedTime,
      completionPercentage: Number(formData.completionPercentage),
      createdAt: project ? project.createdAt : new Date().toISOString(),
    };
    onSave(formattedData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { onOpenChange(isOpen); if (!isOpen) setEditingSubTask(null); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project ? "Update the details of your project." : "Fill in the details for your new project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="project-form" className="space-y-4 py-4 overflow-y-auto flex-grow pr-2">
          <ProjectFormFields
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleSliderChange={handleSliderChange}
            categories={categories}
          />
          <div className="space-y-3 border-t pt-4">
            <Label className="text-lg font-medium">Sub-tasks</Label>
            <SubTaskForm
              newSubTaskTitle={newSubTaskTitle} setNewSubTaskTitle={setNewSubTaskTitle}
              newSubTaskDescription={newSubTaskDescription} setNewSubTaskDescription={setNewSubTaskDescription}
              newSubTaskPriority={newSubTaskPriority} setNewSubTaskPriority={setNewSubTaskPriority}
              newSubTaskDueDate={newSubTaskDueDate} setNewSubTaskDueDate={setNewSubTaskDueDate}
              handleAddOrUpdateSubTask={handleAddOrUpdateSubTask}
              editingSubTask={editingSubTask} setEditingSubTask={setEditingSubTask}
              resetSubTaskFormFields={resetSubTaskFormFields}
            />
            <SubTaskList
              subTasks={formData.subTasks}
              handleToggleSubTask={handleToggleSubTask}
              handleEditSubTask={handleEditSubTask}
              handleDeleteSubTask={handleDeleteSubTask}
            />
          </div>
        </form>

        <DialogFooter className="mt-auto pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="project-form">{project ? "Update Project" : "Create Project"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ProjectForm };
