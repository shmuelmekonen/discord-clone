import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Hash, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface ServerIdPageProps {
  params: Promise<{
    serverId: string;
  }>;
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) return redirect("/sign-in");

  const { serverId } = await params;

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="bg-main flex flex-col h-full items-center justify-center space-y-4">
      <div className="mb-4 p-4 bg-input rounded-full shadow-inner">
        {server.imageUrl ? (
          <div className="relative h-24 w-24">
            <Image
              fill
              src={server.imageUrl}
              alt={server.name}
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="h-24 w-24 bg-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {server.name[0]}
          </div>
        )}
      </div>

      <h2 className="text-3xl font-bold text-header">
        Welcome to {server.name}
      </h2>

      <p className="text-desc text-center max-w-sm">
        Welcome to the server lobby! <br />
        Hop into a channel or DM a friend to start the conversation.
      </p>

      <div className="flex gap-4 mt-8">
        <div className="flex flex-col items-center p-4 bg-zinc-200 dark:bg-[#2B2D31] rounded-lg w-32">
          <Hash className="w-8 h-8 text-zinc-600 mb-2" />
          <span className="text-sm font-bold text-header">Channels</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-zinc-200 dark:bg-[#2B2D31] rounded-lg w-32">
          <ShieldCheck className="w-8 h-8 text-indigo-500 mb-2" />
          <span className="text-sm font-bold text-header">Safe Space</span>
        </div>
      </div>
    </div>
  );
};

export default ServerIdPage;
