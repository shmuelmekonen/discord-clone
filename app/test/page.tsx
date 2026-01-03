"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useOptimistic, useState } from "react";

let initialServers = [
  { id: "1", name: "server 1" },
  { id: "2", name: "server 2" },
  { id: "3", name: "server 3" },
  { id: "4", name: "server 4" },
  { id: "5", name: "server 5" },
];

const Test = () => {
  const router = useRouter();

  const [optimisticServers, setOptimisticServers] = useOptimistic(
    initialServers,
    (originalServers, id) => originalServers.filter((s) => s.id !== id)
  );

  const onClick = (id: string) => {
    startTransition(async () => {
      setOptimisticServers(id);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      initialServers = initialServers.filter((s) => s.id !== id);
      console.log("initialServers", initialServers);
      console.log("useOptimistic - optimisticServers", optimisticServers);
      router.refresh();
    });
  };

  return (
    <div className="flex-col w-20 ">
      {optimisticServers.map((server) => (
        <button
          className="my-2"
          key={server.id}
          onClick={() => onClick(server.id)}
        >
          {server.name}
        </button>
      ))}
    </div>
  );
};

export default Test;
