import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean up existing data (careful in production!)
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.studentSubject.deleteMany();
  await prisma.teacherSubject.deleteMany();
  await prisma.timetableSlot.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  // 1. Create Department
  const csDept = await prisma.department.create({
    data: { name: "Computer Science", code: "CS" },
  });

  // 2. Create Course
  const btech = await prisma.course.create({
    data: { name: "B.Tech Computer Science", code: "BTECH-CS", departmentId: csDept.id },
  });

  // 3. Create Semester
  const sem6 = await prisma.semester.create({
    data: { number: 6, courseId: btech.id },
  });

  // 4. Create Subjects
  const subj1 = await prisma.subject.create({
    data: { name: "Web Technologies", code: "CS601", courseId: btech.id, semesterId: sem6.id },
  });
  
  const subj2 = await prisma.subject.create({
    data: { name: "Artificial Intelligence", code: "CS602", courseId: btech.id, semesterId: sem6.id },
  });

  // 5. Create Admin
  await prisma.user.create({
    data: { name: "Super Admin", email: "admin@nova.edu", password, role: "ADMIN" },
  });

  // 6. Create Teacher
  const teacherUser = await prisma.user.create({
    data: { name: "Prof. Alan Turing", email: "teacher@nova.edu", password, role: "TEACHER" },
  });
  
  const teacher = await prisma.teacher.create({
    data: { userId: teacherUser.id, departmentId: csDept.id },
  });

  await prisma.teacherSubject.create({
    data: { teacherId: teacher.id, subjectId: subj1.id },
  });

  // 7. Create Student
  const studentUser = await prisma.user.create({
    data: { name: "Alice Smith", email: "student@nova.edu", password, role: "STUDENT" },
  });

  const student = await prisma.student.create({
    data: { userId: studentUser.id, departmentId: csDept.id, semesterId: sem6.id, enrollmentNo: "STU001" },
  });

  await prisma.studentSubject.create({
    data: { studentId: student.id, subjectId: subj1.id },
  });
  
  await prisma.studentSubject.create({
    data: { studentId: student.id, subjectId: subj2.id },
  });

  console.log("Seeding complete! You can log in with:");
  console.log("Admin: admin@nova.edu / password123");
  console.log("Teacher: teacher@nova.edu / password123");
  console.log("Student: student@nova.edu / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
