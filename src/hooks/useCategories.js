import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { generateRandomColor } from "@/lib/utils";

export function useCategories(projects) {
  const [categories, setCategories] = useLocalStorage("categories", []);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    if (!storedCategories || JSON.parse(storedCategories).length === 0) {
      const defaultCategory = {
        id: "default",
        name: "General",
        color: "#3b82f6"
      };
      setCategories([defaultCategory]);
    }
  }, [setCategories]);


  const handleAddCategory = () => {
    setSelectedCategory(null);
    setCategoryFormOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryFormOpen(true);
  };

  const handleSaveCategory = (categoryData) => {
    const isNew = !categoryData.id || !categories.some(c => c.id === categoryData.id);

    let categoryToSave = { ...categoryData };
    if (isNew) {
      categoryToSave.id = uuidv4();
      categoryToSave.color = categoryToSave.color || generateRandomColor();
    }

    if (isNew) {
      setCategories(prevCategories => [...prevCategories, categoryToSave]);
      toast({
        title: "Category created",
        description: `${categoryToSave.name} has been added successfully.`
      });
    } else {
      setCategories(prevCategories => prevCategories.map(c => c.id === categoryToSave.id ? categoryToSave : c));
      toast({
        title: "Category updated",
        description: `${categoryToSave.name} has been updated successfully.`
      });
    }
    setCategoryFormOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (categoryId) => {
    if (categoryId === "default" && categories.length === 1) {
        toast({
            title: "Cannot delete default category",
            description: "The default category cannot be deleted if it's the only one.",
            variant: "destructive"
        });
        return;
    }
    const inUse = projects.some(p => p.categoryId === categoryId);
    if (inUse) {
      toast({
        title: "Cannot delete category",
        description: "This category is being used by one or more projects.",
        variant: "destructive"
      });
      return;
    }
    setCategories(prevCategories => prevCategories.filter(c => c.id !== categoryId));
    toast({
      title: "Category deleted",
      description: "The category has been removed successfully.",
      variant: "destructive"
    });
  };

  return {
    categories,
    categoryFormOpen,
    selectedCategory,
    setCategoryFormOpen,
    handleAddCategory,
    handleEditCategory,
    handleSaveCategory,
    handleDeleteCategory,
  };
}
