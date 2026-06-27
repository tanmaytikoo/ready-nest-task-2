export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-8rem)]">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center w-16 h-16">
          {/* Outer glowing spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin shadow-[0_0_15px_rgba(var(--primary),0.5)]" style={{ animationDuration: '1.5s' }}></div>
          
          {/* Inner rotating logo */}
          <img 
            src="/logo-transparent.png" 
            alt="Loading..." 
            className="w-7 h-7 object-contain animate-pulse [filter:brightness(0)] dark:[filter:brightness(1)]" 
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-bold text-foreground tracking-[0.2em] uppercase">Nova</p>
          <p className="text-[10px] font-medium text-muted-foreground animate-pulse tracking-widest uppercase">Loading Data...</p>
        </div>
      </div>
    </div>
  );
}
