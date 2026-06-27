"use client";

import { useState, useTransition } from "react";
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { Task } from "@prisma/client";
import { createTask, updateTaskStatus, deleteTask } from "./actions";
import { Plus, Trash2, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const COLUMNS = [
  { id: "PENDING", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "COMPLETED", title: "Done" },
];

export function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as "PENDING" | "IN_PROGRESS" | "COMPLETED";

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));

    startTransition(async () => {
      try {
        await updateTaskStatus(taskId, newStatus);
      } catch (e) {
        // Revert on failure
        setTasks(initialTasks);
      }
    });
  }

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-full">
        {COLUMNS.map((col) => (
          <Column 
            key={col.id} 
            column={col} 
            tasks={tasks.filter((t) => t.status === col.id)} 
            setTasks={setTasks}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function Column({ column, tasks, setTasks }: any) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const title = newTaskTitle;
    const deadline = newTaskDeadline ? new Date(newTaskDeadline) : null;
    
    setNewTaskTitle("");
    setNewTaskDeadline("");
    setIsAdding(false);
    
    // Quick Add
    const res = await createTask(title, deadline);
    setTasks((prev: any) => [res, ...prev]);
  }

  return (
    <div className="flex flex-col rounded-3xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 bg-card/40 backdrop-blur-xl p-3 overflow-hidden h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="font-semibold text-base text-gradient">{column.title}</h3>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-background/60 rounded-md text-foreground">
          {tasks.length}
        </span>
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto space-y-2 px-1 pb-4">
        {column.id === "PENDING" && (
          <div className="mb-3">
            {isAdding ? (
              <form onSubmit={handleAddTask} className="flex flex-col gap-2 p-3 rounded-2xl bg-background/50 border-[0.3px] border-white/40 dark:border-white/10 backdrop-blur-xl">
                <Input 
                  autoFocus
                  placeholder="Task title..." 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="bg-transparent border-none focus-visible:ring-0 px-1 h-8 text-sm"
                />
                <Input 
                  type="date"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className="bg-transparent border-none focus-visible:ring-0 px-1 h-8 text-xs text-muted-foreground w-full"
                />
                <div className="flex justify-end gap-2 mt-2 border-t border-border/40 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)} className="h-6 text-[10px] hover:bg-background/60 px-2">Cancel</Button>
                  <Button type="submit" size="sm" className="h-6 text-[10px] bg-primary text-primary-foreground px-3">Add Task</Button>
                </div>
              </form>
            ) : (
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-2xl border border-dashed border-border/60 text-muted-foreground hover:bg-background/40 hover:text-foreground transition-all text-xs group"
              >
                <Plus className="w-3 h-3 group-hover:scale-110 transition-transform" /> Add Task
              </button>
            )}
          </div>
        )}

        {tasks.map((task: any) => (
          <TaskCard key={task.id} task={task} setTasks={setTasks} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, isOverlay, setTasks }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    touchAction: 'none',
  } : {
    touchAction: 'none',
  };

  async function handleDelete() {
    if (!setTasks) return;
    setTasks((prev: any) => prev.filter((t: any) => t.id !== task.id));
    await deleteTask(task.id);
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group relative flex flex-col p-3 rounded-2xl border-[0.3px] border-white/40 dark:border-white/10 bg-card backdrop-blur-3xl transition-all ${isDragging ? "opacity-50 scale-105 shadow-2xl z-50" : "shadow-sm hover:shadow-md hover:border-white/60"} ${isOverlay ? "scale-105 shadow-2xl rotate-2 cursor-grabbing z-50 ring-2 ring-primary/20" : "cursor-grab"}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-foreground text-xs leading-snug">{task.title}</p>
        <button 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1 -mr-1 -mt-1 text-muted-foreground hover:text-red-500 transition-all rounded-lg hover:bg-red-500/10 flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3">
        {task.deadline && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium bg-background/50 px-1.5 py-0.5 rounded-md">
            <CalendarIcon className="w-2.5 h-2.5" />
            {new Date(task.deadline).toISOString().split('T')[0]}
          </div>
        )}
        {task.priority && (
           <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wider ${task.priority === 'HIGH' ? 'bg-red-500/10 text-red-500' : task.priority === 'NORMAL' ? 'bg-blue-500/10 text-blue-500' : 'bg-neutral-500/10 text-neutral-500'}`}>
             {task.priority}
           </span>
        )}
      </div>
    </div>
  );
}
