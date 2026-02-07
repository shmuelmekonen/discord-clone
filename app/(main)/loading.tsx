"use client";

import { Skeleton } from "@/components/ui/skeleton";

const MainLoading = () => {
  return (
    <div className="flex h-full w-full bg-main z-50">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 md:left-[72px]">
        <div className="flex flex-col h-full w-full bg-sidebar">
          <div className="h-12 w-full px-3 flex items-center shadow-sm">
            <Skeleton className="h-6 w-32 bg-mobile" />
          </div>
          <div className="flex-1 px-3 mt-4 space-y-2">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-20 bg-mobile" />
              <Skeleton className="h-4 w-4 bg-mobile" />
            </div>
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-8 w-full rounded-md bg-mobile mb-1"
              />
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 h-full md:pl-[312px] flex flex-col items-center justify-center p-4 space-y-4">
        <div className="md:hidden absolute top-4 left-4">
          <Skeleton className="h-8 w-8 rounded-md bg-input" />
        </div>

        <div className="mb-4 p-4 bg-input rounded-full shadow-inner">
          <Skeleton className="h-24 w-24 rounded-full bg-sidebar" />
        </div>

        <Skeleton className="h-10 w-64 bg-input rounded-lg" />

        <div className="space-y-2 flex flex-col items-center w-full">
          <Skeleton className="h-4 w-60 bg-sidebar" />
          <Skeleton className="h-4 w-48 bg-sidebar" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-sm">
          <div className="flex flex-col items-center p-4 bg-input border border-menu rounded-lg aspect-square justify-center gap-2">
            <Skeleton className="h-8 w-8 rounded bg-sidebar" />
            <Skeleton className="h-4 w-16 bg-sidebar" />
          </div>
          <div className="flex flex-col items-center p-4 bg-input border border-menu rounded-lg aspect-square justify-center gap-2">
            <Skeleton className="h-8 w-8 rounded bg-sidebar" />
            <Skeleton className="h-4 w-16 bg-sidebar" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLoading;
