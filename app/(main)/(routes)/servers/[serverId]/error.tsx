"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Server Error:", error);
  }, [error]);

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <AlertTriangle className="h-10 w-10 text-rose-500" />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Something went wrong in this channel.
      </p>
      <Button onClick={() => reset()} variant="outline" size="sm">
        <RefreshCcw className="h-4 w-4 mr-2" />
        Reload Channel
      </Button>
    </div>
  );
}
