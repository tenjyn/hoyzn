import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AppHeader = ({ onAddProject }) => {
  return (
    <header className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Project Tracker
        </h1>
        <div className="flex space-x-2">
          <Button onClick={onAddProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>
    </header>
  );
};

export { AppHeader };
