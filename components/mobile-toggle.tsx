import { Menu } from "lucide-react";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ServerSidebar } from "./server/server-sidebar";
import { cn } from "@/lib/utils";

const MobileToggle = ({ serverId }: { serverId?: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetTitle className="hidden">Navigation Menu</SheetTitle>

      <SheetContent
        side="left"
        className={cn(
          "p-0 flex gap-0",
          "flex-row",
          serverId ? "w-[312px] max-w-[100vw]" : "w-[72px] [&>button]:hidden",
        )}
      >
        <div className="w-[72px] shrink-0 h-full">
          <NavigationSidebar />
        </div>

        {serverId && (
          <div className="w-60 h-full">
            <ServerSidebar serverId={serverId} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
