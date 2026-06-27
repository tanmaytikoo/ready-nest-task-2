import { Metadata } from "next";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ProgressClient } from "@/components/student/ProgressClient";

export const metadata: Metadata = {
  title: "Progress | Nova",
  description: "Student Progress Analytics",
};

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-muted-foreground">Loading session...</div>;
  }

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    include: {
      subjects: {
        include: {
          subject: {
            include: {
              attendances: {
                include: {
                  records: true
                }
              }
            }
          }
        }
      },
      attendanceRecords: true,
      tasks: true,
    }
  });

  if (!student) {
    return <div className="p-8 text-destructive">Student profile not found.</div>;
  }

  // Aggregate attendance per subject for bar chart
  const attendanceData = student.subjects.map((ss) => {
    const subject = ss.subject;
    const total = subject.attendances.length;
    
    const attendedRecords = student.attendanceRecords.filter(
      (ar) => subject.attendances.some(a => a.id === ar.attendanceId) && (ar.status === "PRESENT" || ar.status === "LATE")
    );
    const attended = attendedRecords.length;
    const percentage = total === 0 ? 100 : Math.round((attended / total) * 100);

    return {
      subjectName: subject.name,
      percentage
    };
  });

  // Aggregate tasks for pie chart
  const pendingCount = student.tasks.filter(t => t.status === "PENDING").length;
  const inProgressCount = student.tasks.filter(t => t.status === "IN_PROGRESS").length;
  const completedCount = student.tasks.filter(t => t.status === "COMPLETED").length;

  const taskData = [
    { name: "Pending", value: pendingCount },
    { name: "In Progress", value: inProgressCount },
    { name: "Completed", value: completedCount },
  ];

  return (
    <div className="flex flex-col gap-8 relative z-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gradient">Academic Progress</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">Visualize your attendance trends and assignment completion.</p>
      </div>

      <ProgressClient attendanceData={attendanceData} taskData={taskData} />
    </div>
  );
}
