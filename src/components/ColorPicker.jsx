import React from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const PRESET_COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#eab308", // Yellow
  "#84cc16", // Lime
  "#22c55e", // Green
  "#10b981", // Emerald
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
  "#0ea5e9", // Sky
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#a855f7", // Purple
  "#d946ef", // Fuchsia
  "#ec4899", // Pink
  "#f43f5e", // Rose
];

const ColorPicker = ({ color, onChange, className }) => {
  const [tempColor, setTempColor] = React.useState(color || "#3b82f6");

  const handleColorChange = (e) => {
    setTempColor(e.target.value);
    onChange(e.target.value);
  };

  const handlePresetClick = (presetColor) => {
    setTempColor(presetColor);
    onChange(presetColor);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "w-10 h-10 rounded-full cursor-pointer border border-input flex items-center justify-center",
            className
          )}
          style={{ backgroundColor: tempColor }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Color</Label>
            <div className="text-xs text-muted-foreground">{tempColor}</div>
          </div>

          <div
            className="w-full h-24 rounded-md border border-input"
            style={{ backgroundColor: tempColor }}
          />

          <input
            type="color"
            value={tempColor}
            onChange={handleColorChange}
            className="w-full h-10"
          />

          <div className="grid grid-cols-6 gap-2">
            {PRESET_COLORS.map((presetColor) => (
              <div
                key={presetColor}
                className="w-8 h-8 rounded-full cursor-pointer border border-input"
                style={{ backgroundColor: presetColor }}
                onClick={() => handlePresetClick(presetColor)}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { ColorPicker };
