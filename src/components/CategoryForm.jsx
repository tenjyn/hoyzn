import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ColorPicker";
import { generateRandomColor } from "@/lib/utils";

const CategoryForm = ({ 
  open, 
  onOpenChange, 
  onSave, 
  category = null 
}) => {
  const getInitialFormData = () => ({
    id: uuidv4(),
    name: "",
    color: generateRandomColor()
  });

  const [formData, setFormData] = useState(getInitialFormData());
  
  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({
          id: category.id,
          name: category.name || "",
          color: category.color || generateRandomColor()
        });
      } else {
        setFormData(getInitialFormData());
      }
    }
  }, [category, open]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleColorChange = (color) => {
    setFormData(prev => ({ ...prev, color }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return; 
    }
    onSave(formData);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex items-center space-x-4">
              <ColorPicker 
                color={formData.color} 
                onChange={handleColorChange} 
              />
              <span className="text-sm">{formData.color}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{category ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { CategoryForm };
