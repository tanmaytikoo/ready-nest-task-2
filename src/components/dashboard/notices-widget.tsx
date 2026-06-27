import { Megaphone, FileText } from "lucide-react";

const notices = [
  {
    id: 1,
    title: "Mid-Term Examination Schedule Released",
    author: "Dept. of Computer Science",
    date: "2 hours ago",
    type: "important",
  },
  {
    id: 2,
    title: "Guest Lecture: AI & Future Tech",
    author: "Prof. Alan Turing",
    date: "Yesterday",
    type: "event",
  },
  {
    id: 3,
    title: "Library closed for maintenance",
    author: "Admin Office",
    date: "2 days ago",
    type: "general",
  },
];

export function NoticesWidget() {
  return (
    <div className="space-y-4 mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {notices.map((notice) => (
        <div key={notice.id} className="p-4 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col h-full">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className={`p-2 rounded-lg ${
              notice.type === "important" ? "bg-red-500/10 text-red-500" :
              notice.type === "event" ? "bg-blue-500/10 text-blue-500" :
              "bg-muted text-muted-foreground"
            }`}>
              {notice.type === "important" ? <Megaphone className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">{notice.date}</span>
          </div>
          
          <h4 className="text-sm font-semibold leading-tight mb-1 flex-1">
            {notice.title}
          </h4>
          <p className="text-xs text-muted-foreground">
            {notice.author}
          </p>
        </div>
      ))}
    </div>
  );
}
