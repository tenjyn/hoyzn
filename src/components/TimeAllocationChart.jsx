import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border border-border rounded shadow-lg">
        <p className="label">{`${payload[0].name} : ${payload[0].value.toFixed(1)}h`}</p>
      </div>
    );
  }
  return null;
};

const TimeAllocationChart = ({ project, dailyHours = 8, monthlyHours = 160, yearlyHours = 1920 }) => {
  
  const TIME_PERIODS = {
    DAY: { name: `Daily Capacity (${dailyHours}h)`, hours: dailyHours },
    MONTH: { name: `Monthly Capacity (${monthlyHours}h)`, hours: monthlyHours },
    YEAR: { name: `Yearly Capacity (${yearlyHours}h)`, hours: yearlyHours },
  };

  if (!project || project.initialEstimatedTime === null || project.initialEstimatedTime === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Time Allocation Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No estimated time provided for this project to generate analysis.</p>
        </CardContent>
      </Card>
    );
  }

  const projectHours = project.initialEstimatedTime;

  const chartData = Object.entries(TIME_PERIODS).map(([key, period]) => {
    const allocated = Math.min(projectHours, period.hours);
    const remaining = Math.max(0, period.hours - allocated);
    return {
      periodName: period.name,
      data: [
        { name: `${project.title}`, value: allocated },
        { name: 'Remaining Capacity', value: remaining },
      ],
      totalCapacity: period.hours,
      projectAllocationPercentage: period.hours > 0 ? (allocated / period.hours) * 100 : 0,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {chartData.map((chart, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-center text-base">{chart.periodName}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                <Pie
                  data={chart.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => chart.totalCapacity > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : (name === `${project.title}` ? `${name} -` : name)}
                >
                  {chart.data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ marginTop: '15px', fontSize: "0.8rem" }} 
                  formatter={(value) => <span className="text-foreground/80 truncate" title={value}>{value}</span>} 
                />
              </PieChart>
            </ResponsiveContainer>
             {chart.totalCapacity > 0 && (
                <p className="text-center text-sm mt-2 text-muted-foreground">
                This project utilizes <strong>{chart.projectAllocationPercentage.toFixed(1)}%</strong> of the {chart.periodName.toLowerCase().split('(')[0].trim()}.
                </p>
             )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { TimeAllocationChart };