import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { TeacherNoticeClient } from "./TeacherNoticeClient";

export const metadata: Metadata = {
  title: "Notices | Nova",
  description: "Notice Board Management",
};

export default async function TeacherNoticesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-muted-foreground">Loading session...</div>;
  }

  const notices = await db.notice.findMany({
    where: { authorId: session.user.id },
    orderBy: [
      { pinned: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  return (
    <div className="flex flex-col gap-6 relative z-10 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Notice Board</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">Create and manage department notices.</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <TeacherNoticeClient initialNotices={notices} />
      </div>
    </div>
  );
}
