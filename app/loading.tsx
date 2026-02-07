import { Gamepad2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center bg-main z-50">
      <div className="flex flex-col items-center gap-y-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-14 w-14 bg-indigo-500/30 rounded-full animate-ping" />

          <div className="relative bg-indigo-500 p-3 rounded-2xl shadow-xl">
            <Gamepad2 className="h-8 w-8 text-white animate-pulse" />
          </div>
        </div>

        <p className="text-xs font-bold text-desc uppercase tracking-widest animate-pulse">
          Starting Engine...
        </p>
      </div>
    </div>
  );
};

export default Loading;
