"use client";

import { useState } from "react";
import { Pin, Calendar, User } from "lucide-react";
import { markNoticeAsRead } from "./actions";

export function StudentNoticesClient({ initialNotices, userId }: { initialNotices: any[], userId: string }) {
  const [notices, setNotices] = useState(initialNotices);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNoticeAsRead(id);
      setNotices(prev => prev.map(n => n.id === id ? { ...n, reads: [{ id: 'temp' }] } : n));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-8 pr-2">
      {notices.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center h-64 text-muted-foreground border border-dashed border-border/60 rounded-3xl">
          <p>No new notices.</p>
        </div>
      )}

      {notices.map(notice => {
        const isRead = notice.reads?.length > 0;
        
        return (
          <div 
            key={notice.id} 
            className={`flex flex-col p-6 rounded-3xl border-[0.3px] transition-all hover:shadow-xl relative overflow-hidden group ${
              isRead ? 'bg-card/40 border-white/10' : 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5'
            } backdrop-blur-xl`}
          >
            {!isRead && (
              <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
            
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider ${
                    notice.category === 'EMERGENCY' ? 'bg-red-500/10 text-red-500' :
                    notice.category === 'EVENTS' ? 'bg-purple-500/10 text-purple-500' :
                    notice.category === 'ACADEMIC' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-neutral-500/10 text-neutral-500'
                  }`}>
                    {notice.category}
                  </span>
                  {notice.pinned && <Pin className="w-3.5 h-3.5 text-orange-500" />}
                </div>
                <h3 className={`font-semibold text-lg ${!isRead ? 'text-foreground' : 'text-foreground/80'}`}>
                  {notice.title}
                </h3>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6 line-clamp-4">
              {notice.content}
            </p>
            
            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3" /> {notice.author.name}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> {new Date(notice.createdAt).toISOString().split('T')[0]}
                </div>
              </div>
              
              {!isRead && (
                <button 
                  onClick={() => handleMarkAsRead(notice.id)}
                  className="text-[10px] font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
