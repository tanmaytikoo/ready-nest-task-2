import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { TeacherStudentsClient } from "./TeacherStudentsClient";

export const metadata: Metadata = {
  title: "Students | Nova",
  description: "Student Management",
};

export default async function TeacherStudentsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-muted-foreground">Loading session...</div>;
  }

  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id },
    include: {
      subjects: {
        include: {
          subject: {
            include: {
              students: {
                include: {
                  student: {
                    include: {
                      user: true,
                      department: true,
                      semester: true,
                      attendanceRecords: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!teacher) {
    return <div className="p-8 text-red-500">Teacher profile not found.</div>;
  }

  // Flatten and deduplicate students taught by this teacher
  const studentMap = new Map();
  teacher.subjects.forEach(ts => {
    ts.subject.students.forEach(ss => {
      if (!studentMap.has(ss.student.id)) {
        // Calculate attendance basic stats across all records for this student 
        // Note: In real app, only show attendance for teacher's subjects.
        // Doing basic calculation for UI purposes here.
        const total = ss.student.attendanceRecords.length;
        const present = ss.student.attendanceRecords.filter(r => r.status === "PRESENT" || r.status === "LATE").length;
        
        studentMap.set(ss.student.id, {
          id: ss.student.id,
          name: ss.student.user.name,
          email: ss.student.user.email,
          avatar: ss.student.user.avatar,
          enrollmentNo: ss.student.enrollmentNo,
          department: ss.student.department.name,
          semester: ss.student.semester.number,
          attendancePercent: total === 0 ? 100 : Math.round((present / total) * 100)
        });
      }
    });
  });

  const students = Array.from(studentMap.values());

  return (
    <div className="flex flex-col gap-6 relative z-10 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Student Directory</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">View and analyze students enrolled in your classes.</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <TeacherStudentsClient students={students} />
      </div>
    </div>
  );
}
