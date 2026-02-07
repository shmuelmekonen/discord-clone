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

const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetTitle className="hidden">Navigation Menu</SheetTitle>
      <SheetContent side="left" className="p-0 flex-row gap-0 w-[312px]">
        <div className="w-[72px] shrink-0">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
