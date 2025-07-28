import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { generateRandomColor } from '@/lib/utils';
import RecurringTaskItem from './RecurringTaskItem';

export const RecurringTasksManager = ({ tasks, setTasks, type }) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null); 

  const totalHours = type === 'daily' ? 24 : 168; 

  const handleUpdateTask = (id, updatedTask) => {
    setTasks(prevTasks => prevTasks.map(task => (task.id === id ? updatedTask : task)));
  };

  const handleDeleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    if (editingTaskId === id) setEditingTaskId(null);
  };

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;
    const newTask = {
      id: uuidv4(),
      name: newTaskName.trim(),
      hours: 1,
      isFixed: false,
      color: generateRandomColor(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setNewTaskName('');
  };
  
  const totalAllocatedHours = tasks.reduce((sum, task) => sum + task.hours, 0);

  const handleEditToggle = (taskId) => {
    setEditingTaskId(prevId => prevId === taskId ? null : taskId);
  };

  const userTasks = tasks.filter(task => !task.isFromWeekly);
  const derivedTasks = tasks.filter(task => task.isFromWeekly);

  return (
    <div className="space-y-3 sm:space-y-4">
        {userTasks.filter(task => task.isFixed).map(task => (
            <RecurringTaskItem
            key={task.id} task={task}
            onUpdate={handleUpdateTask}
            isFixed={true}
            totalHoursType={type}
            onEditToggle={() => {}} 
            editingTaskId={null}
            />
        ))}
        {userTasks.filter(task => !task.isFixed).map(task => (
            <RecurringTaskItem
            key={task.id} task={task}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            isFixed={false}
            totalHoursType={type}
            onEditToggle={handleEditToggle}
            editingTaskId={editingTaskId}
            />
        ))}
        {derivedTasks.length > 0 && (
          <div className="pt-2">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 pl-1">From Weekly</h4>
            <div className="space-y-3 sm:space-y-4">
              {derivedTasks.map(task => (
                <RecurringTaskItem
                  key={task.id} task={task}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                  isFixed={false}
                  totalHoursType={type}
                  onEditToggle={() => {}}
                  editingTaskId={null}
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center space-x-2 pt-2 sm:pt-4">
            <Input
            type="text" placeholder={`New ${type} task`}
            value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)}
            className="flex-grow h-10"
            />
            <Button onClick={handleAddTask} variant="outline" size="icon" className="h-10 w-10">
                <PlusCircle className="h-5 w-5" />
            </Button>
        </div>
         {totalAllocatedHours > totalHours && (
            <p className="text-sm text-destructive text-center font-medium">
            Warning: Total allocated ({totalAllocatedHours.toFixed(1)}h) exceeds {totalHours}h!
            </p>
        )}
    </div>
  );
};
