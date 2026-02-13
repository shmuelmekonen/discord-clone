"use client";

import { useEffect } from "react";
import { Gamepad2, RefreshCcw } from "lucide-react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Root Layout Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#313338] text-white font-sans antialiased">
        <div className="h-full min-h-screen flex flex-col items-center justify-center space-y-6 p-6 text-center">
          <div className="bg-rose-500/10 p-6 rounded-full animate-pulse">
            <Gamepad2 className="w-20 h-20 text-rose-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              System Critical Error
            </h1>
            <p className="text-zinc-400 max-w-md mx-auto text-lg">
              The application encountered a fatal error and cannot render the
              layout.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="flex items-center gap-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold transition-all hover:scale-105"
          >
            <RefreshCcw className="w-5 h-5" />
            Restart Application
          </button>

          <div className="pt-8">
            <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest">
              Error Digest: {error.digest || "UNKNOWN_CRITICAL_FAILURE"}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
