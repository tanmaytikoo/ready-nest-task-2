import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Dashboard | Nova",
  description: "Teacher Command Center",
};

export default async function TeacherDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-muted-foreground">Loading session...</div>;
  }

  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id },
    include: {
      department: true,
      subjects: {
        include: { subject: true }
      },
    }
  });

  if (!teacher) {
    return <div className="p-8 text-red-500">Teacher profile not found. Please contact admin.</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-8 relative z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gradient">Teacher Command Center</h1>
          <p className="text-muted-foreground mt-1 text-sm">Welcome back, {session.user.name}! Here's your teaching overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 rounded-3xl bg-card backdrop-blur-xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 p-4 flex flex-col justify-center relative overflow-hidden group">
            <h3 className="text-muted-foreground text-xs font-medium z-10">Subjects Assigned</h3>
            <p className="text-2xl font-bold mt-1 text-foreground z-10 text-gradient">{teacher.subjects.length}</p>
          </div>
          <div className="h-28 rounded-3xl bg-card backdrop-blur-xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 p-4 flex flex-col justify-center relative overflow-hidden group">
            <h3 className="text-muted-foreground text-xs font-medium z-10">Department</h3>
            <p className="text-xl font-bold mt-1 text-foreground z-10 text-gradient truncate">{teacher.department.name}</p>
          </div>
          <div className="h-28 rounded-3xl bg-card backdrop-blur-xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 p-4 flex flex-col justify-center relative overflow-hidden group">
            <h3 className="text-muted-foreground text-xs font-medium z-10">Pending Attendance</h3>
            <p className="text-2xl font-bold mt-1 text-foreground z-10 text-gradient">2</p>
          </div>
          <div className="h-28 rounded-3xl bg-card backdrop-blur-xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 p-4 flex flex-col justify-center relative overflow-hidden group">
            <h3 className="text-muted-foreground text-xs font-medium z-10">Active Assignments</h3>
            <p className="text-2xl font-bold mt-1 text-foreground z-10 text-gradient">4</p>
          </div>
        </div>
      </div>
    </>
  );
}
