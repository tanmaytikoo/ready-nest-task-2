import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { StudentNoticesClient } from "./StudentNoticesClient";

export const metadata: Metadata = {
  title: "Notices | Nova",
  description: "Global and Department Notices",
};

export default async function StudentNoticesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    include: { department: true }
  });

  if (!student) return <div className="p-8 text-red-500">Student not found.</div>;

  // Fetch all notices (Global, Academic, Events, Exams, Department, etc.)
  const notices = await db.notice.findMany({
    include: {
      author: { select: { name: true } },
      reads: {
        where: { userId: session.user.id }
      }
    },
    orderBy: [
      { pinned: "desc" },
      { createdAt: "desc" }
    ]
  });

  return (
    <div className="flex flex-col gap-6 relative z-10 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Notice Board</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">Stay updated with the latest announcements.</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <StudentNoticesClient initialNotices={notices} userId={session.user.id} />
      </div>
    </div>
  );
}
