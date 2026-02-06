import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Hash, ShieldCheck } from "lucide-react";

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
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full items-center justify-center space-y-4">
      <div className="mb-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full shadow-inner">
        {server.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={server.imageUrl}
            alt={server.name}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="h-24 w-24 bg-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {server.name[0]}
          </div>
        )}
      </div>

      <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200">
        Welcome to {server.name}
      </h2>

      <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
        You are now in the server lobby. <br />
        Check out the channels on the left to join the conversation.
      </p>

      <div className="flex gap-4 mt-8">
        <div className="flex flex-col items-center p-4 bg-zinc-100 dark:bg-[#2B2D31] rounded-lg w-32">
          <Hash className="w-8 h-8 text-zinc-500 mb-2" />
          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            Channels
          </span>
        </div>
        <div className="flex flex-col items-center p-4 bg-zinc-100 dark:bg-[#2B2D31] rounded-lg w-32">
          <ShieldCheck className="w-8 h-8 text-indigo-500 mb-2" />
          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            Safe Space
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServerIdPage;
