"use client";

import { joinServerWithInviteUrl } from "@/actions/server-actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import { useState, useTransition } from "react";
import { useServerNavigationStore } from "@/hooks/use-server-navigation-store";

interface JoinServerModalProps {
  server: {
    id: string;
    name: string;
    imageUrl: string;
    profileId: string;
  };
  inviteCode: string;
  profileId: string;
}

const JoinServerModal = ({
  server,
  inviteCode,
  profileId,
}: JoinServerModalProps) => {
  const router = useRouter();
  const { dispatchOptimistic, clearAction } = useServerNavigationStore();
  const [isPending, startTransition] = useTransition();

  const onJoin = async () => {
    const tempId = `temp-${Date.now()}`;

    startTransition(async () => {
      try {
        dispatchOptimistic(tempId, {
          type: "CREATE",
          server: {
            ...server,
            id: tempId,
            inviteCode,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        const { data, error } = await joinServerWithInviteUrl(inviteCode);

        if (error || !data) {
          toast.error(error || "Failed to join");
          return;
        }

        const { server: serverToJoin, joinedNew } = data;

        if (joinedNew) {
          toast.success(`Welcome to ${serverToJoin.name}'s server!`);
        }
        router.push(`/servers/${serverToJoin.id}`);
      } catch (error) {
        toast.error("Failed to join server");
      } finally {
        clearAction(tempId);
      }
    });
  };

  return (
    <div className="bg-[#313338] p-10 rounded-lg shadow-2xl text-center w-[400px] border border-zinc-700">
      <div className="relative w-24 h-24 mx-auto mb-4">
        <Image
          src={server.imageUrl}
          alt={server.name}
          fill
          className="rounded-3xl object-cover"
        />
      </div>
      <p className="text-zinc-400 text-sm font-semibold mb-1">
        You have been invited to
      </p>
      <h1 className="text-white text-2xl font-bold mb-6">{server.name}</h1>
      <div className="flex flex-col gap-y-3">
        <Button
          disabled={isPending}
          onClick={onJoin}
          size="lg"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold"
        >
          Join Server
          <UserPlus className="w-5 h-5 mr-2" />
        </Button>
        <Button
          disabled={isPending}
          onClick={() => router.push("/")}
          variant="ghost"
          className="text-zinc-400 hover:text-white"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
};

export default JoinServerModal;
