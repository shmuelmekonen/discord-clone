"use client";

import { useEffect } from "react";
import { Gamepad2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical App Error:", error);
  }, [error]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-main space-y-6 p-6 text-center">
      <div className="bg-rose-500/10 p-4 rounded-2xl">
        <Gamepad2 className="w-12 h-12 text-rose-500" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-header">
          Something went wrong
        </h1>
        <p className="text-desc max-w-sm mx-auto">
          We encountered a connection issue. This usually happens due to a slow
          network or a temporary service glitch.
        </p>
      </div>

      <Button
        onClick={() => reset()}
        variant="primary"
        className="flex items-center gap-x-2"
      >
        <RefreshCcw className="w-4 h-4" />
        Try again
      </Button>

      <p className="text-dim text-xs opacity-50 font-mono">
        Error ID: {error.digest || "N/A"}
      </p>
    </div>
  );
}
