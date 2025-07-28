import React, { useContext, useState, useMemo } from 'react';
import AppContext from '@/AppContext';
import { DashboardStats } from '@/components/DashboardStats';
import { RecurringTasksManager } from '@/components/recurring/RecurringTasksManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, Calendar as CalendarIcon, BarChart3, Repeat } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { Label } from '@/components/ui/label';

const TimeAllocationChart = ({ data, title, totalCapacity, unassignedTime }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data.filter(d => d.value > 0)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        labelLine={false}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `${value.toFixed(1)}h`} />
                    <Legend wrapperStyle={{ marginTop: '15px', fontSize: "0.8rem" }} />
                </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm mt-2 text-muted-foreground">
                Unassigned: {unassignedTime.toFixed(1)}h / {totalCapacity.toFixed(1)}h
            </p>
        </CardContent>
    </Card>
);

const DashboardPage = () => {
    const {
        projectHookData,
        weeklyTasksHookData,
        dayProfilesHookData,
        dayClassificationsHookData,
    } = useContext(AppContext);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const { projects } = projectHookData;
    const { weeklyTasks, setWeeklyTasks } = weeklyTasksHookData;
    const { profiles: dayProfiles, setProfiles: setDayProfiles } = dayProfilesHookData;
    const { dayClassifications, setDayClassifications } = dayClassificationsHookData;
    const { toast } = useToast();

    const handleDayProfileChange = (date, profileId) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        setDayClassifications(prev => ({...prev, [dateKey]: profileId}));
        toast({ title: 'Day Classified', description: `${format(date, 'PPP')} has been set.` });
    };

    const DayProfileSelector = ({ date }) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const currentProfileId = dayClassifications[dateKey];
        const currentProfile = dayProfiles.find(p => p.id === currentProfileId);

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {currentProfile ? (
                            <div className="flex items-center">
                                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: currentProfile.color }}></div>
                                {currentProfile.name}
                            </div>
                        ) : 'Select Profile'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <div className="p-2 space-y-1">
                        {dayProfiles.map(profile => (
                            <Button key={profile.id} variant="ghost" className="w-full justify-start" onClick={() => handleDayProfileChange(date, profile.id)}>
                                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: profile.color }}></div>
                                {profile.name}
                            </Button>
                        ))}
                         <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => handleDayProfileChange(date, null)}>
                            Clear Profile
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        )
    };

    const DayCellContent = ({ date }) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const profileId = dayClassifications[dateKey];
        const profile = profileId ? dayProfiles.find(p => p.id === profileId) : null;
        if (!profile) return null;
        return <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: profile.color }} />;
    };

    const { dailyChartData, weeklyChartData, monthlyChartData } = useMemo(() => {
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        const profileId = dayClassifications[dateKey];
        const selectedDayProfile = dayProfiles.find(p => p.id === profileId);

        const dailyTasksForDay = selectedDayProfile ? selectedDayProfile.tasks : [];
        const weeklyTasksAsDaily = weeklyTasks.map(wt => ({...wt, name: `${wt.name} (W)`, hours: wt.hours / 7, isFromWeekly: true }));
        const combinedDailyTasks = [...dailyTasksForDay, ...weeklyTasksAsDaily];
        const totalDailyCommitments = combinedDailyTasks.reduce((sum, task) => sum + task.hours, 0);
        const dailyUnassigned = 24 - totalDailyCommitments;

        const weeklyRecurringTotal = weeklyTasks.reduce((sum, task) => sum + task.hours, 0);
        const weeklyUnassigned = 168 - weeklyRecurringTotal;

        const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
        const weeksInMonth = daysInMonth / 7;

        const avgDailyHours = dayProfiles.length > 0 ? dayProfiles.reduce((sum, p) => sum + p.tasks.reduce((tsum, t) => tsum + t.hours, 0), 0) / dayProfiles.length : 8;
        const monthlyDailyTotal = avgDailyHours * daysInMonth;
        const monthlyWeeklyTotal = weeklyRecurringTotal * weeksInMonth;
        const monthlyUnassigned = (24 * daysInMonth) - monthlyDailyTotal - monthlyWeeklyTotal;

        return {
            dailyChartData: {
                title: <><Clock className="mr-2 h-5 w-5 text-primary" /> Daily View: {format(selectedDate, 'PPP')}</>,
                data: [...combinedDailyTasks.map(t => ({ name: t.name, value: t.hours, color: t.color })), { name: 'Unassigned', value: dailyUnassigned, color: '#00C49F' }],
                totalCapacity: 24, unassignedTime: dailyUnassigned,
            },
            weeklyChartData: {
                title: <><CalendarIcon className="mr-2 h-5 w-5 text-primary" /> Weekly Recurring</>,
                data: [...weeklyTasks.map(t => ({ name: t.name, value: t.hours, color: t.color })), { name: 'Unassigned', value: weeklyUnassigned, color: '#00C49F' }],
                totalCapacity: 168, unassignedTime: weeklyUnassigned,
            },
            monthlyChartData: {
                title: <><BarChart3 className="mr-2 h-5 w-5 text-primary" /> Monthly Overview ({format(selectedDate, 'MMMM')})</>,
                data: [
                    { name: `Daily Tasks (Avg)`, value: monthlyDailyTotal, color: '#FFBB28' },
                    { name: `Weekly Tasks`, value: monthlyWeeklyTotal, color: '#8884d8' },
                    { name: 'Free for Projects', value: monthlyUnassigned, color: '#00C49F' },
                ],
                totalCapacity: 24 * daysInMonth, unassignedTime: monthlyUnassigned,
            }
        };
    }, [selectedDate, weeklyTasks, dayProfiles, dayClassifications]);

    return (
        <div className="space-y-6 sm:space-y-8">
            <DashboardStats projects={projects} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <TimeAllocationChart {...dailyChartData} />
                    <TimeAllocationChart {...weeklyChartData} />
                    <TimeAllocationChart {...monthlyChartData} />
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><CalendarIcon className="mr-2 h-5 w-5 text-primary" /> Day Classification</CardTitle>
                            <CardDescription>Select a day to view its profile or assign a new one.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border p-0" components={{ Day: DayCellContent }} />
                            <div className="w-full mt-4">
                                <Label className="mb-2 block text-sm font-medium">Profile for {format(selectedDate, 'PPP')}:</Label>
                                <DayProfileSelector date={selectedDate} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Repeat className="mr-2 h-5 w-5 text-primary" /> Weekly Tasks</CardTitle>
                            <CardDescription>Manage your standard weekly recurring tasks.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecurringTasksManager tasks={weeklyTasks} setTasks={setWeeklyTasks} type="weekly" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
