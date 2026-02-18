"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/components/providers/socket-provider";
import { SOCKET_EVENTS } from "@/lib/routes";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/lib/constants";

export const SocketEventProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { socket, isConnected } = useSocket();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !socket || !isConnected || !params?.serverId) {
      return;
    }

    const serverId = params.serverId as string;

    socket.on(SOCKET_EVENTS.serverDeleted(serverId), () => {
      toast.error(TOAST_MESSAGES.SOCKET.SERVER_DELETED);
      router.push("/");
      router.refresh();
    });

    socket.on(SOCKET_EVENTS.serverUpdated(serverId), () => {
      router.refresh();
    });

    return () => {
      socket.off(SOCKET_EVENTS.serverDeleted(serverId));
      socket.off(SOCKET_EVENTS.serverUpdated(serverId));
    };
  }, [socket, isConnected, router, params?.serverId, isMounted]);

  return <>{children}</>;
};
