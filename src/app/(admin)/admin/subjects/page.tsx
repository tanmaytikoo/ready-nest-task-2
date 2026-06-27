import { db } from "@/lib/db";
import { AdminSubjectsClient } from "./AdminSubjectsClient";

export default async function SubjectsPage() {
  const [subjects, courses, teachers] = await Promise.all([
    db.subject.findMany({
      include: {
        course: true,
        semester: true,
        teachers: {
          include: {
            teacher: {
              include: { user: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    }),
    db.course.findMany({
      include: { semesters: true }
    }),
    db.teacher.findMany({
      include: { user: true }
    })
  ]);

  return <AdminSubjectsClient initialSubjects={subjects} courses={courses} teachers={teachers} />;
}
