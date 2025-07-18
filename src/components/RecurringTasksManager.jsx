import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Palette, GripVertical, Edit2, Save, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { generateRandomColor } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RecurringTaskItem = ({ task, onUpdate, onDelete, isFixed, totalHoursType, onEditToggle, editingTaskId }) => {
  const [localHours, setLocalHours] = useState(task.hours);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(task.name);

  useEffect(() => {
    setLocalHours(task.hours);
  }, [task.hours]);

  const handleSliderChange = (value) => {
    setLocalHours(value[0]);
    onUpdate(task.id, { ...task, hours: value[0] });
  };

  const handleInputChange = (e) => {
    let newHours = parseFloat(e.target.value);
    if (isNaN(newHours)) newHours = 0;
    if (newHours < 0) newHours = 0;
    
    const maxHours = totalHoursType === 'daily' ? 24 : (totalHoursType === 'weekly' ? 168 : 0);
    if (newHours > maxHours && maxHours > 0) newHours = maxHours;

    setLocalHours(newHours);
  };
  
  const handleInputBlur = () => {
    onUpdate(task.id, { ...task, hours: localHours });
  };
  
  const handleNameChange = (e) => {
    setTempName(e.target.value);
  };

  const saveNameChange = () => {
    onUpdate(task.id, { ...task, name: tempName });
    setIsEditingName(false);
  };

  const cancelNameChange = () => {
    setTempName(task.name);
    setIsEditingName(false);
  };

  const handleColorChange = (e) => {
    onUpdate(task.id, { ...task, color: e.target.value });
  };

  const isCurrentlyEditingThis = editingTaskId === task.id;

  return (
    <div className={`p-3 sm:p-4 border rounded-lg space-y-3 bg-card hover:shadow-md transition-shadow ${isCurrentlyEditingThis ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        {isFixed || (!isFixed && !isEditingName && !isCurrentlyEditingThis) ? (
          <Label className="text-sm sm:text-base font-medium flex items-center truncate" title={task.name}>
            <span className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: task.color }}></span>
            <span className="truncate">{task.name}</span>
          </Label>
        ) : null}

        {!isFixed && (isEditingName || isCurrentlyEditingThis) && (
           <div className="flex items-center gap-2 flex-grow">
             <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab hidden sm:block shrink-0" />
             <Input 
                value={tempName} 
                onChange={handleNameChange} 
                className="text-sm sm:text-base font-medium flex-grow h-8 sm:h-10"
                placeholder="Task Name"
             />
           </div>
        )}
        
        <div className="flex items-center shrink-0">
            {!isFixed && !isEditingName && !isCurrentlyEditingThis && (
              <Button variant="ghost" size="icon" onClick={() => { setIsEditingName(true); onEditToggle(task.id); }} className="h-7 w-7 sm:h-8 sm:w-8">
                <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            )}
            {!isFixed && (isEditingName || isCurrentlyEditingThis) && (
                <>
                <Button variant="ghost" size="icon" onClick={saveNameChange} className="h-7 w-7 sm:h-8 sm:w-8">
                    <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={cancelNameChange} className="h-7 w-7 sm:h-8 sm:w-8">
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                </Button>
                </>
            )}
            {!isFixed && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="relative ml-1">
                                <Input 
                                    type="color" 
                                    value={task.color} 
                                    onChange={handleColorChange}
                                    className="w-6 h-6 sm:w-7 sm:h-7 p-0 border-none cursor-pointer appearance-none rounded-full"
                                />
                                <Palette className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-background pointer-events-none" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent><p>Change Color</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
            {!isFixed && (
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="h-7 w-7 sm:h-8 sm:w-8 ml-0.5">
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
            </Button>
            )}
        </div>

      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Slider
          value={[localHours]}
          onValueChange={handleSliderChange}
          max={totalHoursType === 'daily' ? 24 : (totalHoursType === 'weekly' ? 168 : 24)}
          step={0.5}
          className="flex-grow"
          trackClassName="h-2 sm:h-3"
          rangeClassName="bg-gradient-to-r from-blue-400 to-purple-500"
          thumbClassName="h-4 w-4 sm:h-5 sm:w-5 border-2"
        />
        <Input 
            type="number" 
            value={localHours.toString()} 
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min="0"
            max={totalHoursType === 'daily' ? 24 : (totalHoursType === 'weekly' ? 168 : 24)}
            step="0.5"
            className="w-16 sm:w-20 text-sm sm:text-base h-8 sm:h-10 text-right"
        />
        <span className="text-xs sm:text-sm font-semibold w-8 text-left">hrs</span>
      </div>
    </div>
  );
};

const RecurringTasksPieChart = ({ tasks, totalHours }) => {
  const totalAllocated = tasks.reduce((sum, task) => sum + task.hours, 0);
  const freeTime = Math.max(0, totalHours - totalAllocated);

  const chartData = tasks.map(task => ({ name: task.name, value: task.hours, color: task.color }));
  if (freeTime > 0) {
    chartData.push({ name: 'Free for Projects', value: freeTime, color: '#00C49F' }); // Green for free time
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardContent className="p-2 sm:p-4">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent, value }) => value > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#cccccc'} />
              ))}
            </Pie>
            <RechartsTooltip formatter={(value, name) => [`${value.toFixed(1)}h`, name]} />
            <Legend iconSize={8} wrapperStyle={{fontSize: "0.75rem"}} formatter={(value) => <span className="truncate text-muted-foreground" title={value}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
         <p className="text-center text-xs sm:text-sm mt-2 text-muted-foreground">
            Total Allocated: {totalAllocated.toFixed(1)}h / {totalHours}h. Free for Projects: {freeTime.toFixed(1)}h.
        </p>
      </CardContent>
    </Card>
  );
};


export const RecurringTasksManager = ({ tasks, setTasks, type }) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null); // Track which task name is being edited

  const totalHours = type === 'daily' ? 24 : 168; // 24 for daily, 168 for weekly

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

  return (
    <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4 lg:col-span-1">
            {tasks.filter(task => task.isFixed).map(task => (
                <RecurringTaskItem
                key={task.id} task={task}
                onUpdate={handleUpdateTask}
                isFixed={true}
                totalHoursType={type}
                onEditToggle={() => {}} 
                editingTaskId={null}
                />
            ))}
            {tasks.filter(task => !task.isFixed).map(task => (
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
            <RecurringTasksPieChart tasks={tasks} totalHours={totalHours} />
        </div>
    </div>
  );
};