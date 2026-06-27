import { Calendar, CheckCircle2, Circle } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "OS Assignment 3",
    subject: "Operating Systems",
    dueDate: "Today",
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    title: "Data Structures Lab Report",
    subject: "Data Structures",
    dueDate: "Tomorrow",
    status: "completed",
    priority: "medium",
  },
  {
    id: 3,
    title: "Read Chapter 4",
    subject: "Computer Networks",
    dueDate: "In 2 days",
    status: "pending",
    priority: "low",
  },
];

export function TasksWidget() {
  return (
    <div className="space-y-4 mt-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors">
          <button className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors">
            {task.status === "completed" ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium truncate ${task.status === "completed" ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {task.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground truncate">{task.subject}</span>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <div className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md border ${
                task.dueDate === "Today" 
                  ? "bg-red-500/10 text-red-500 border-red-500/20" 
                  : "bg-muted text-muted-foreground border-border/50"
              }`}>
                <Calendar className="w-3 h-3" />
                {task.dueDate}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
