import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Palette, GripVertical, Edit2, Save, X, Trash2, Info } from 'lucide-react';
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

  const isFromWeekly = task.isFromWeekly === true;

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
    onEditToggle(null); 
  };

  const cancelNameChange = () => {
    setTempName(task.name);
    setIsEditingName(false);
    onEditToggle(null); 
  };

  const handleColorChange = (e) => {
    onUpdate(task.id, { ...task, color: e.target.value });
  };

  const isCurrentlyEditingThis = editingTaskId === task.id;

  return (
    <div className={`p-3 sm:p-4 border rounded-lg space-y-3 bg-card hover:shadow-md transition-shadow ${isCurrentlyEditingThis ? 'ring-2 ring-primary' : ''} ${isFromWeekly ? 'opacity-70 border-dashed' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        {isFixed || (!isFixed && !isEditingName && !isCurrentlyEditingThis) ? (
          <Label className="text-sm sm:text-base font-medium flex items-center truncate" title={task.name}>
            <span className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: task.color }}></span>
            <span className="truncate">{task.name}</span>
            {isFromWeekly && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 ml-2 text-muted-foreground shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a daily breakdown of a weekly task. Edit in the 'Weekly' tab.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
                disabled={isFromWeekly}
             />
           </div>
        )}
        
        <div className="flex items-center shrink-0">
            {!isFixed && !isEditingName && !isCurrentlyEditingThis && !isFromWeekly && (
              <Button variant="ghost" size="icon" onClick={() => { setIsEditingName(true); onEditToggle(task.id); }} className="h-7 w-7 sm:h-8 sm:w-8">
                <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            )}
            {!isFixed && (isEditingName || isCurrentlyEditingThis) && !isFromWeekly && (
                <>
                <Button variant="ghost" size="icon" onClick={saveNameChange} className="h-7 w-7 sm:h-8 sm:w-8">
                    <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={cancelNameChange} className="h-7 w-7 sm:h-8 sm:w-8">
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                </Button>
                </>
            )}
            {!isFixed && !isFromWeekly && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="relative ml-1">
                                <Input 
                                    type="color" 
                                    value={task.color} 
                                    onChange={handleColorChange}
                                    className="w-6 h-6 sm:w-7 sm:h-7 p-0 border-none cursor-pointer appearance-none rounded-full"
                                    disabled={isFromWeekly}
                                />
                                <Palette className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-background pointer-events-none" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent><p>Change Color</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
            {!isFixed && !isFromWeekly && (
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
          disabled={isFromWeekly}
        />
        <Input 
            type="number" 
            value={isFromWeekly ? localHours.toFixed(2) : localHours.toString()} 
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min="0"
            max={totalHoursType === 'daily' ? 24 : (totalHoursType === 'weekly' ? 168 : 24)}
            step="0.5"
            className="w-16 sm:w-20 text-sm sm:text-base h-8 sm:h-10 text-right"
            disabled={isFromWeekly}
            readOnly={isFromWeekly}
        />
        <span className="text-xs sm:text-sm font-semibold w-8 text-left">hrs</span>
      </div>
    </div>
  );
};

export default RecurringTaskItem;
