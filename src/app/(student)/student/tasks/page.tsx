import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { KanbanBoard } from "./KanbanBoard";

export const metadata = {
  title: "Tasks | Nova",
  description: "Manage your academic workload",
};

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-muted-foreground">Loading session...</div>;
  }

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
  });

  if (!student) {
    return <div className="p-8 text-red-500">Student profile not found.</div>;
  }

  const tasks = await db.task.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4 relative z-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Tasks</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">Manage your academic workload with instant drag-and-drop.</p>
      </div>

      <div className="flex-1 overflow-y-auto lg:overflow-hidden pb-10 lg:pb-0">
        <KanbanBoard initialTasks={tasks} />
      </div>
    </div>
  );
}
