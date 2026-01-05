"use client";

import { useOptimistic, useEffect, startTransition } from "react";
import { Server } from "@prisma/client";
import { useServerNavigationStore } from "@/hooks/use-server-navigation-store";
import { serversReducer } from "@/lib/optimistic-reducer";
import { NavigationItem } from "./navigation-item";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

export const NavigationList = ({ servers }: { servers: Server[] }) => {
  const { activeActions } = useServerNavigationStore();

  const [optimisticServers, updateUI] = useOptimistic(servers, serversReducer);

  useEffect(() => {
    startTransition(() => {
      updateUI(activeActions);
    });
  }, [activeActions, updateUI, servers]);

  return (
    <ScrollArea className="flex-1 w-full">
      {optimisticServers.map((server) => {
        const isPending = !!activeActions[server.id];
        const isTemporary = server.id.startsWith("temp-");

        return (
          <div
            key={server.id}
            className={cn(
              "mb-4 transition-all",
              isTemporary || isPending
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
        );
      })}
    </ScrollArea>
  );
};
