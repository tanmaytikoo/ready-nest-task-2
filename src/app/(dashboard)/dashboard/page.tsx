import { Card } from "@/components/ui/card";
import { ScheduleWidget } from "@/components/dashboard/schedule-widget";
import { AttendanceWidget } from "@/components/dashboard/attendance-widget";
import { TasksWidget } from "@/components/dashboard/tasks-widget";
import { NoticesWidget } from "@/components/dashboard/notices-widget";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Tanmay!</h1>
        <p className="text-muted-foreground mt-2">Here is your academic overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1 md:col-span-2 border-border/50 bg-card/50 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-lg font-semibold border-b border-border/40 pb-4">Today's Schedule</h2>
          <ScheduleWidget />
        </Card>

        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-md relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent -z-10"></div>
          <h2 className="text-lg font-semibold">Attendance</h2>
          <AttendanceWidget />
        </Card>
        
        <Card className="p-6 col-span-1 md:col-span-3 border-border/50 bg-card/50 backdrop-blur-md">
          <h2 className="text-lg font-semibold border-b border-border/40 pb-4">Recent Notices</h2>
          <NoticesWidget />
        </Card>

        <Card className="p-6 col-span-1 md:col-span-3 border-border/50 bg-card/50 backdrop-blur-md relative overflow-hidden">
          <h2 className="text-lg font-semibold border-b border-border/40 pb-4">Tasks & Deadlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-3">
              <TasksWidget />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
