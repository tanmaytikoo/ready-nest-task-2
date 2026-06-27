import { db } from "@/lib/db";
import { AdminDepartmentsClient } from "./AdminDepartmentsClient";

export default async function DepartmentsPage() {
  const departments = await db.department.findMany({
    include: {
      courses: {
        include: {
          semesters: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return <AdminDepartmentsClient initialDepartments={departments} />;
}
