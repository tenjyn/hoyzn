import React, { useContext } from 'react';
import AppContext from '@/AppContext';
import DayProfileManager from '@/components/DayProfileManager';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

const SettingsPage = () => {
  const { dayProfilesHookData } = useContext(AppContext);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <DayProfileManager 
        profiles={dayProfilesHookData.profiles} 
        setProfiles={dayProfilesHookData.setProfiles} 
      />

    </div>
  );
};

export default SettingsPage;