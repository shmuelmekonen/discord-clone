"use client";

import { useOptimistic, useEffect } from "react";
import { Server } from "@prisma/client";
import { useServerNavigationStore } from "@/hooks/use-server-navigation-store";
import { serversReducer } from "@/lib/optimistic-reducer";
import { NavigationItem } from "./navigation-item";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

export const NavigationList = ({ servers }: { servers: Server[] }) => {
  const { activeAction } = useServerNavigationStore();

  const [optimisticServers, updateUI] = useOptimistic(servers, serversReducer);

  useEffect(() => {
    if (activeAction) {
      updateUI(activeAction);
    }
  }, [activeAction, updateUI]);

  return (
    <ScrollArea className="flex-1 w-full">
      {optimisticServers.map((server) => (
        <div
          key={server.id}
          className={cn(
            "mb-4 transition-all",
            server.id.startsWith("temp-")
              ? "opacity-40 blur-[0.5px] pointer-events-none"
              : "opacity-100"
          )}
        >
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
