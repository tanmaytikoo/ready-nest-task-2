import { Metadata } from "next";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { AttendanceClient } from "@/components/student/AttendanceClient";

export const metadata: Metadata = {
  title: "Attendance | Nova",
  description: "Student Attendance Tracker",
};

export default async function AttendancePage() {
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
                  records: {
                    where: { studentId: undefined } // We will filter in JS if needed, but we need all records for this student specifically. Actually, let's fetch differently to be safe.
                  }
                }
              }
            }
          }
        }
      },
      attendanceRecords: true,
    }
  });

  if (!student) {
    return <div className="p-8 text-destructive">Student profile not found.</div>;
  }

  // Aggregate attendance per subject
  const subjectAttendance = student.subjects.map((ss) => {
    const subject = ss.subject;
    
    // Total classes held for this subject is the number of `Attendance` records for this subject.
    const total = subject.attendances.length;
    
    // Classes attended by THIS student for THIS subject
    const attendedRecords = student.attendanceRecords.filter(
      (ar) => subject.attendances.some(a => a.id === ar.attendanceId) && (ar.status === "PRESENT" || ar.status === "LATE")
    );
    const attended = attendedRecords.length;

    const percentage = total === 0 ? 100 : Math.round((attended / total) * 100);

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      total,
      attended,
      percentage
    };
  });

  return (
    <div className="flex flex-col gap-8 relative z-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gradient">Attendance Predictor</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">Track your subject-wise attendance and plan your leaves safely.</p>
      </div>

      <AttendanceClient subjects={subjectAttendance} />
    </div>
  );
}
