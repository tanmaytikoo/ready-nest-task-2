import { db } from "@/lib/db";
import { Users, Layers, BookOpen, GraduationCap } from "lucide-react";

export default async function AdminDashboard() {
  const [students, teachers, departments, subjects] = await Promise.all([
    db.student.count(),
    db.teacher.count(),
    db.department.count(),
    db.subject.count(),
  ]);

  const stats = [
    { label: "Total Students", value: students, icon: GraduationCap },
    { label: "Total Teachers", value: teachers, icon: Users },
    { label: "Departments", value: departments, icon: Layers },
    { label: "Total Subjects", value: subjects, icon: BookOpen },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">System-wide overview and statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
              <stat.icon className="w-16 h-16" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</p>
            <h2 className="text-4xl font-bold text-foreground">{stat.value}</h2>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Setup Guide</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
          <li>Create <strong>Departments</strong> (e.g., Computer Science).</li>
          <li>Create <strong>Courses</strong> under those departments (e.g., B.Tech CSE).</li>
          <li>Assign <strong>Semesters</strong> to courses.</li>
          <li>Create <strong>Subjects</strong> for those semesters.</li>
          <li>Assign <strong>Teachers</strong> to subjects so they can mark attendance and give assignments.</li>
        </ol>
      </div>
    </div>
  );
}
