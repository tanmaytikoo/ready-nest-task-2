import { Clock, MapPin } from "lucide-react";

const schedule = [
  {
    id: 1,
    subject: "Data Structures",
    time: "09:00 AM - 10:30 AM",
    room: "Room 402",
    type: "Lecture",
    status: "completed",
  },
  {
    id: 2,
    subject: "Computer Networks",
    time: "11:00 AM - 12:30 PM",
    room: "Lab 2",
    type: "Lab",
    status: "current",
  },
  {
    id: 3,
    subject: "Operating Systems",
    time: "02:00 PM - 03:30 PM",
    room: "Room 305",
    type: "Lecture",
    status: "upcoming",
  },
];

export function ScheduleWidget() {
  return (
    <div className="space-y-6 mt-4">
      <div className="relative border-l-2 border-border/60 ml-3 space-y-8">
        {schedule.map((item) => (
          <div key={item.id} className="relative pl-6">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background ${
                item.status === "completed"
                  ? "bg-muted-foreground"
                  : item.status === "current"
                  ? "bg-primary animate-pulse"
                  : "bg-muted border-border"
              }`}
            />
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold ${item.status === "current" ? "text-primary" : "text-foreground"}`}>
                  {item.subject}
                </h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border/50 uppercase tracking-wider">
                  {item.type}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.room}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
