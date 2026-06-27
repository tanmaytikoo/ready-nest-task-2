import { db } from "@/lib/db";
import { AdminUsersClient } from "./AdminUsersClient";

export default async function UsersPage() {
  const users = await db.user.findMany({
    include: {
      student: {
        include: { department: true, semester: true }
      },
      teacher: {
        include: { department: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const departments = await db.department.findMany();
  const semesters = await db.semester.findMany();

  return <AdminUsersClient initialUsers={users} departments={departments} semesters={semesters} />;
}
