import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, CheckCircle2, Zap } from 'lucide-react';
import { getUpcomingProjects } from '@/lib/utils';

const StatCard = ({ title, value, icon, description, trend, unit = '' }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 sm:pt-6">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {React.createElement(icon, { className: "h-4 w-4 text-muted-foreground" })}
    </CardHeader>
    <CardContent className="pb-4 sm:pb-6">
      <div className="text-2xl font-bold">{value}{unit}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {trend && <p className={`text-xs ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</p>}
    </CardContent>
  </Card>
);


const DashboardStats = ({ projects }) => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'done' || p.completionPercentage === 100).length;
  const upcomingProjectsCount = getUpcomingProjects(projects).length;

  const totalEstimatedTimeAllProjects = projects.reduce((sum, p) => sum + (p.initialEstimatedTime || 0), 0);
  const totalTimeRemainingAllProjects = projects.reduce((sum, p) => sum + (p.timeRemaining === null || p.timeRemaining === undefined ? (p.initialEstimatedTime || 0) : p.timeRemaining), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Projects" value={totalProjects} icon={Zap} description="All active and past projects." />
        <StatCard title="Completed Projects" value={completedProjects} icon={CheckCircle2} description={`${totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(0) : 0}% done`} />
        <StatCard title="Upcoming (7 days)" value={upcomingProjectsCount} icon={Clock} description="Tasks due soon." />
        <StatCard title="Total Est. Hours" value={totalEstimatedTimeAllProjects.toFixed(1)} unit="h" icon={TrendingUp} description={`Remaining: ${totalTimeRemainingAllProjects.toFixed(1)}h`} />
      </div>
    </div>
  );
};

export { DashboardStats };
