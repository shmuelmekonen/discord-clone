"use client";

import { useOptimistic, useEffect } from "react";
import { Server } from "@prisma/client";
import { useServerNavigationStore } from "@/hooks/use-server-navigation-store";
import { serversReducer } from "@/lib/optimistic-reducer";
import { NavigationItem } from "./navigation-item";
import { ScrollArea } from "../ui/scroll-area";

export const NavigationList = ({ servers }: { servers: Server[] }) => {
  const { activeAction } = useServerNavigationStore();

  // 1. הגדרת ההוק האופטימי עם ה-Reducer מה-LIB
  const [optimisticServers, updateUI] = useOptimistic(
    servers,
    serversReducer // המוח שכתבנו בשלב 1
  );

  // 2. האזנה לסטור - כל פעם שיש פעולה חדשה, נעדכן את ה-UI
  useEffect(() => {
    if (activeAction) {
      updateUI(activeAction);
    }
  }, [activeAction, updateUI]);

  return (
    <ScrollArea className="flex-1 w-full">
      {optimisticServers.map((server) => (
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
