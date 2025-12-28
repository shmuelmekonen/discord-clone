"use client";

import { joinServerWithInviteUrl } from "@/actions/server-actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";

interface JoinServerModalProps {
  serverName: string;
  serverImage: string;
  inviteCode: string;
}

const JoinServerModal = ({
  serverName,
  serverImage,
  inviteCode,
}: JoinServerModalProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onJoin = async () => {
    try {
      setIsLoading(true);
      const result = await joinServerWithInviteUrl(inviteCode);

      if (result?.error) {
        toast.error(`${result.error}`);
        return;
      }

      if (result?.server) {
        router.push(`/servers/${result.server.id}`);
        toast.success(`Welcome to ${serverName}'s server!`);
      }
    } catch (error) {
      toast.error("Something went Wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-[#313338] p-10 rounded-lg shadow-2xl text-center w-[400px] border border-zinc-700">
      <div className="relative w-24 h-24 mx-auto mb-4">
        <Image
          src={serverImage}
          alt={serverName}
          fill
          className="rounded-3xl object-cover"
        />
      </div>
      <p className="text-zinc-400 text-sm font-semibold mb-1">
        You have been invited to
      </p>
      <h1 className="text-white text-2xl font-bold mb-6">{serverName}</h1>
      <div className="flex flex-col gap-y-3">
        <Button
          disabled={isLoading}
          onClick={onJoin}
          size="lg"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold"
        >
          Join Server
          <UserPlus className="w-5 h-5 mr-2" />
        </Button>
        <Button
          disabled={isLoading}
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
