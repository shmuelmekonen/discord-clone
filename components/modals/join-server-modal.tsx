"use client";

import { joinServerWithInviteUrl } from "@/actions/server-actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { SOCKET_EVENTS } from "@/lib/routes";
import { TOAST_MESSAGES } from "@/lib/constants";

interface JoinServerModalProps {
  server: {
    id: string;
    name: string;
    imageUrl: string;
  };
  inviteCode: string;
}

const JoinServerModal = ({ server, inviteCode }: JoinServerModalProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onJoin = async () => {
    try {
      setIsLoading(true);

      const result = await joinServerWithInviteUrl(inviteCode);
      const { data, error } = result;

      if (error || !data) {
        toast.error(error || TOAST_MESSAGES.SERVER.JOIN_ERROR);
        return;
      }

      const { server: joinedServer, joinedNew } = data;

      if (joinedNew) {
        toast.success(TOAST_MESSAGES.SERVER.JOIN_SUCCESS(joinedServer.name));

        try {
          fetch("/api/socket/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              serverId: joinedServer.id,
              event: SOCKET_EVENTS.SERVER_UPDATE,
            }),
            keepalive: true,
          });
          window.location.assign(`/servers/${joinedServer.id}`);
        } catch (error) {
          console.error("REALTIME_SIGNAL_ERROR", error);
        }
      } else {
        router.push(`/servers/${joinedServer.id}`);
        router.refresh();
      }
    } catch (err) {
      console.log(err);
      toast.error(TOAST_MESSAGES.SERVER.JOIN_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-main p-10 rounded-lg shadow-2xl text-center w-[95vw] max-w-[400px] border border-menu">
      <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
        <Image
          src={server.imageUrl}
          alt={server.name}
          fill
          className="object-cover"
        />
      </div>
      <p className="text-desc text-sm font-semibold mb-1">
        You have been invited to
      </p>
      <h1 className="text-header text-2xl font-bold mb-6">{server.name}</h1>
      <div className="flex flex-col gap-y-3">
        <Button
          disabled={isLoading}
          onClick={onJoin}
          size="lg"
          className="bg-indigo-500 hover:bg-indigo-600 text-header font-bold"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <>
              Join Server
              <UserPlus className="w-5 h-5 mr-2" />
            </>
          )}
        </Button>
        <Button
          disabled={isLoading}
          onClick={() => router.push("/")}
          variant="ghost"
          className="text-desc hover:text-header"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
};

export default JoinServerModal;
