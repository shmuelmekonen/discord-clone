"use client";

import { Server } from "@prisma/client";
import { NavigationItem } from "./navigation-item";
import { ScrollArea } from "../ui/scroll-area";

export const NavigationList = ({ servers }: { servers: Server[] }) => {
  return (
    <ScrollArea className="flex-1 w-full">
      {servers.map((server) => (
        <div key={server.id} className="mb-4">
          <NavigationItem
            id={server.id}
            imageUrl={server.imageUrl}
            name={server.name}
          />
        </div>
      ))}
    </ScrollArea>
  );
};
