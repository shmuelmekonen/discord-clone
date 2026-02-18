import { Gamepad2, Menu } from "lucide-react";
import { OnboardingActions } from "./onboarding-actions";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const InitialDashboard = () => {
  return (
    <div className="h-full flex flex-col bg-main">
      <div className="md:hidden flex items-center px-4 h-14 border-b-2 border-menu bg-main shrink-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="text-desc" />
            </Button>
          </SheetTrigger>
          <SheetTitle className="hidden">Navigation Menu</SheetTitle>
          <SheetContent
            side="left"
            className="p-0 flex gap-0 w-[72px] [&>button]:hidden border-r-0"
          >
            <NavigationSidebar />
          </SheetContent>
        </Sheet>
        <span className="ml-4 font-bold text-header text-sm tracking-tight">
          Nexus
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-4xl flex flex-col items-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col items-center gap-y-4 text-center">
            <div className="bg-indigo-500 p-4 rounded-2xl shadow-xl shadow-indigo-500/20">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-header tracking-tight">
              Create your space
            </h1>
            <p className="text-desc text-sm md:text-lg max-w-md mx-auto leading-relaxed">
              You don&apos;t have any servers yet. Join a community or create
              your own to start talking.
            </p>
          </div>

          <div className="w-full flex justify-center">
            <OnboardingActions />
          </div>

          <p className="text-dim text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] opacity-40">
            Explore the side menu (☰)
          </p>
        </div>
      </div>
    </div>
  );
};
