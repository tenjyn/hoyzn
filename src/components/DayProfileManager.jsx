import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { X, PlusCircle, Edit } from 'lucide-react';
import { generateRandomColor } from '@/lib/utils';
import { RecurringTasksManager } from '@/components/recurring/RecurringTasksManager';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from './ui/use-toast';

const DayProfileForm = ({ profile, onSave, onCancel }) => {
    const [name, setName] = useState(profile ? profile.name : '');
    const [color, setColor] = useState(profile ? profile.color : generateRandomColor());
    const [tasks, setTasks] = useState(profile ? profile.tasks : []);

    const handleSave = () => {
        if (!name.trim()) return;
        onSave({
            ...profile,
            id: profile ? profile.id : uuidv4(),
            name,
            color,
            tasks,
        });
    };

    return (
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>{profile ? 'Edit' : 'Create'} Day Profile</DialogTitle>
                <DialogDescription>
                    Define a reusable template for your daily recurring tasks.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">Name</label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="color" className="text-right">Color</label>
                    <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="col-span-3 h-10 p-1" />
                </div>
                <div>
                    <h4 className="font-semibold mb-2 text-center">Recurring Tasks for this Profile</h4>
                    <RecurringTasksManager tasks={tasks} setTasks={setTasks} type="daily" />
                </div>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSave}>Save Profile</Button>
            </DialogFooter>
        </DialogContent>
    );
};

const DayProfileManager = ({ profiles, setProfiles }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    const { toast } = useToast();

    const handleSaveProfile = (profile) => {
        setProfiles(prev => {
            const index = prev.findIndex(p => p.id === profile.id);
            if (index > -1) {
                const updated = [...prev];
                updated[index] = profile;
                return updated;
            }
            return [...prev, profile];
        });
        setIsFormOpen(false);
        setEditingProfile(null);
        toast({ title: "Success", description: `Day profile "${profile.name}" saved.` });
    };
    
    const handleDeleteProfile = (profileId) => {
        setProfiles(prev => prev.filter(p => p.id !== profileId));
        toast({ title: "Success", description: "Day profile deleted." });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Day Profiles</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {profiles.map(profile => (
                        <div key={profile.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderLeft: `4px solid ${profile.color}` }}>
                            <span className="font-medium">{profile.name}</span>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setEditingProfile(profile); setIsFormOpen(true); }}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteProfile(profile.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
                    setIsFormOpen(isOpen);
                    if (!isOpen) setEditingProfile(null);
                }}>
                    <DialogTrigger asChild>
                        <Button className="mt-4 w-full" variant="outline">
                            <PlusCircle className="mr-2 h-4 w-4" /> Create New Profile
                        </Button>
                    </DialogTrigger>
                    <DayProfileForm
                        profile={editingProfile}
                        onSave={handleSaveProfile}
                        onCancel={() => { setIsFormOpen(false); setEditingProfile(null); }}
                    />
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default DayProfileManager;