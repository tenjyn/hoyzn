import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

const RecurringTasksPieChart = ({ tasks, totalHours }) => {
  const totalAllocated = tasks.reduce((sum, task) => sum + task.hours, 0);
  const freeTime = Math.max(0, totalHours - totalAllocated);

  const chartData = tasks.map(task => ({ name: task.name, value: task.hours, color: task.color }));
  if (freeTime > 0) {
    chartData.push({ name: 'Free for Projects', value: freeTime, color: '#00C49F' }); 
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardContent className="p-2 sm:p-4">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
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
            <Legend 
              wrapperStyle={{ marginTop: '15px', fontSize: "0.8rem" }} 
              formatter={(value) => <span className="truncate text-muted-foreground" title={value}>{value}</span>} 
            />
          </PieChart>
        </ResponsiveContainer>
         <p className="text-center text-xs sm:text-sm mt-2 text-muted-foreground">
            Total Allocated: {totalAllocated.toFixed(1)}h / {totalHours}h. Free for Projects: {freeTime.toFixed(1)}h.
        </p>
      </CardContent>
    </Card>
  );
};

export default RecurringTasksPieChart;
