import React from "react";

export function ExplorerGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container">
      <div className="gap-4 grid gap-y-8 grid-cols-1 flex-col p-2 max-w-xl @sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}
