import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { CardLiquidFill } from "@/components/student/CardLiquidFill";

export const metadata: Metadata = {
  title: "Dashboard | Nova",
  description: "Student Command Center",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-muted-foreground">Loading session...</div>;
  }

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    include: {
      attendanceRecords: {
        include: { attendance: true }
      },
      tasks: {
        where: { status: { not: "COMPLETED" } }
      },
      submissions: true,
      department: true,
      semester: true,
    }
  });

  if (!student) {
    return <div className="p-8 text-red-500">Student profile not found. Please contact admin.</div>;
  }

  // Calculate Attendance
  const totalClasses = student.attendanceRecords.length;
  const attendedClasses = student.attendanceRecords.filter(r => r.status === "PRESENT" || r.status === "LATE").length;
  const attendancePercentage = totalClasses === 0 ? 100 : Math.round((attendedClasses / totalClasses) * 100);

  const pendingTasks = student.tasks.length;

  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const todayDayOfWeek = days[new Date().getDay()];

  const todaySlots = await db.timetableSlot.findMany({
    where: {
      timetable: {
        departmentId: student.departmentId,
        semesterId: student.semesterId,
      },
      dayOfWeek: todayDayOfWeek as any,
    },
    include: {
      subject: true,
    },
    orderBy: { startTime: 'asc' }
  });

  return (
    <>
      <div className="flex flex-col gap-8 relative z-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Command Center</h1>
        <p className="text-muted-foreground mt-1 text-sm">Welcome back, {session.user.name}! Here's your academic overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-28 rounded-3xl bg-card border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 flex items-center justify-between relative overflow-hidden group shadow-xl">
          <CardLiquidFill percentage={attendancePercentage} />
          <div className="z-10 absolute inset-0 flex flex-col justify-center p-6 pointer-events-none mix-blend-difference text-white">
            <h3 className="text-xs font-medium opacity-80">Attendance</h3>
            <p className="text-3xl font-bold mt-1 tracking-tighter">{attendancePercentage}%</p>
          </div>
        </div>

        <div className="h-28 rounded-3xl bg-card backdrop-blur-xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 p-4 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-muted-foreground text-xs font-medium z-10">Pending Tasks</h3>
          <p className="text-2xl font-bold mt-1 text-foreground z-10 text-gradient">{pendingTasks}</p>
        </div>
        <div className="h-28 rounded-3xl bg-card backdrop-blur-xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 p-4 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-muted-foreground text-xs font-medium z-10">Classes Today</h3>
          <p className="text-2xl font-bold mt-1 text-foreground z-10 text-gradient">{todaySlots.length}</p>
        </div>
        <div className="h-28 rounded-3xl bg-card backdrop-blur-xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 p-4 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-muted-foreground text-xs font-medium z-10">Study Streak</h3>
          <p className="text-2xl font-bold mt-1 text-foreground z-10 text-gradient">12 Days</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-3xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 bg-card backdrop-blur-xl p-5">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-foreground text-gradient">
            <img src="/logo-transparent.png" alt="" className="w-3.5 h-3.5 object-contain [filter:brightness(0)] dark:[filter:brightness(1)]" />
            Today's Schedule
          </h3>
          <div className="space-y-2">
            {todaySlots.length === 0 ? (
              <div className="flex items-center justify-center p-6 text-sm text-muted-foreground bg-background/30 rounded-2xl border border-dashed border-border/40">
                No classes scheduled for today!
              </div>
            ) : (
              todaySlots.map(slot => (
                <div key={slot.id} className="flex items-center justify-between p-3 rounded-2xl bg-background/50 border border-border/20 hover:bg-accent transition-colors">
                  <div>
                    <p className="font-normal text-sm text-foreground">{slot.subject.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{slot.startTime} - {slot.endTime}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-muted text-foreground rounded-md">{slot.room}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 bg-card backdrop-blur-xl p-5">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-foreground text-gradient">
            <img src="/logo-transparent.png" alt="" className="w-3.5 h-3.5 object-contain [filter:brightness(0)] dark:[filter:brightness(1)]" />
            Upcoming Deadlines
          </h3>
          {pendingTasks === 0 ? (
            <div className="h-28 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/60 rounded-2xl">
              <p className="text-xs">No pending assignments. You're all caught up!</p>
            </div>
          ) : (
             <div className="space-y-2">
               {student.tasks.slice(0, 3).map(task => (
                 <div key={task.id} className="flex items-center justify-between p-3 rounded-2xl bg-background/50 border-l-2 border-border hover:bg-accent transition-colors">
                    <div>
                      <p className="font-normal text-sm text-foreground">{task.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Due: {task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : 'No deadline'}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-muted text-foreground rounded-md">{task.priority}</span>
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
