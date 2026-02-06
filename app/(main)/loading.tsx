"use client";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex h-full w-full bg-white dark:bg-[#313338] z-50">
      <div className="hidden md:flex h-full w-60 flex-col fixed inset-y-0 z-20">
        <div className="flex flex-col h-full w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
          <div className="h-12 w-full px-3 flex items-center shadow-sm">
            <Skeleton className="h-6 w-32 bg-zinc-300 dark:bg-zinc-700" />
          </div>

          <div className="flex-1 px-3 mt-4 space-y-4">
            <Skeleton className="h-8 w-full bg-zinc-300 dark:bg-zinc-700" />

            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2 mt-4">
                <Skeleton className="h-4 w-12 bg-zinc-300 dark:bg-zinc-700" />
                <Skeleton className="h-8 w-full bg-zinc-300 dark:bg-zinc-700" />
                <Skeleton className="h-8 w-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 h-full md:pl-60 flex flex-col">
        <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-4">
          <Skeleton className="h-8 w-8 rounded-full md:hidden mr-2 bg-zinc-300 dark:bg-zinc-700" />
          <Skeleton className="h-6 w-6 mr-2 bg-zinc-300 dark:bg-zinc-700" />
          <Skeleton className="h-6 w-32 bg-zinc-300 dark:bg-zinc-700" />
        </div>

        <div className="flex-1 flex flex-col justify-end p-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-x-3">
              <Skeleton className="h-10 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-zinc-300 dark:bg-zinc-700" />
                <Skeleton className="h-4 w-[250px] md:w-[400px] bg-zinc-300 dark:bg-zinc-700" />
              </div>
            </div>
          ))}
        </div>

        <div className="p-4">
          <Skeleton className="h-14 w-full rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
