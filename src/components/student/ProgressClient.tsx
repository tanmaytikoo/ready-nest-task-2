"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type SubjectAttendance = {
  subjectName: string;
  percentage: number;
};

type TaskStat = {
  name: string;
  value: number;
};

const PIE_COLORS = [
  "var(--muted-foreground)",    // Pending
  "var(--secondary-foreground)", // In Progress
  "var(--primary)",             // Completed
];

export function ProgressClient({
  attendanceData,
  taskData,
}: {
  attendanceData: SubjectAttendance[];
  taskData: TaskStat[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Attendance Chart */}
      <div className="rounded-3xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 bg-card backdrop-blur-xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-foreground">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          Subject-wise Attendance
        </h3>
        <div className="h-72">
          {attendanceData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground border border-dashed rounded-2xl">
              No attendance data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/50" />
                <XAxis dataKey="subjectName" stroke="currentColor" className="text-muted-foreground text-xs" tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" className="text-muted-foreground text-xs" tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: 'var(--accent)', opacity: 0.2 }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
                <Bar dataKey="percentage" fill="var(--color-primary)" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tasks Chart */}
      <div className="rounded-3xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 bg-card backdrop-blur-xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-foreground">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          Task Completion Status
        </h3>
        <div className="h-72">
          {taskData.every(t => t.value === 0) ? (
            <div className="h-full flex items-center justify-center text-muted-foreground border border-dashed rounded-2xl">
              No tasks available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-foreground text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
