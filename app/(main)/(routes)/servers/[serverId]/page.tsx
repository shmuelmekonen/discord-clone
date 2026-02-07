import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Hash, ShieldCheck } from "lucide-react";
import Image from "next/image";
import MobileToggle from "@/components/mobile-toggle";

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
    <div className="bg-main h-full relative">
      <div className="md:hidden flex items-center p-4 absolute top-0 left-0 w-full z-50">
        <MobileToggle serverId={serverId} />
      </div>

      <div className="bg-main flex flex-col h-full items-center justify-center space-y-4">
        <div className="mb-2 md:mb-4 p-3 md:p-4 bg-input rounded-full shadow-inner">
          {server.imageUrl ? (
            <div className="relative h-16 w-16 md:h-24 md:w-24 rounded-full overflow-hidden">
              <Image
                fill
                src={server.imageUrl}
                alt={server.name}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 md:h-24 md:w-24 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl md:text-4xl font-bold">
              {server.name[0]}
            </div>
          )}
        </div>

        <h2 className="text-xl md:text-3xl font-bold text-header text-center px-4">
          Welcome to {server.name}
        </h2>

        <p className="text-desc text-center max-w-sm px-6 text-sm md:text-base">
          Welcome to the server lobby! <br />
          Hop into a channel or DM a friend to start the conversation.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-6 md:mt-8 w-full max-w-[300px] md:max-w-md px-4">
          <div className="flex flex-col items-center justify-center p-4 bg-zinc-200 dark:bg-[#2B2D31] rounded-lg aspect-square w-full">
            <Hash className="w-6 h-6 md:w-8 md:h-8 text-zinc-600 mb-2" />
            <span className="text-xs md:text-sm font-bold text-header text-center">
              Channels
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-zinc-200 dark:bg-[#2B2D31] rounded-lg aspect-square w-full">
            <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-indigo-500 mb-2" />
            <span className="text-xs md:text-sm font-bold text-header text-center">
              Safe Space
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerIdPage;
