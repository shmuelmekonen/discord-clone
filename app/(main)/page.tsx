import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { CreateServerModal } from "@/components/modals/create-server-modal";

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!server) {
    return (
      <div className="h-full">
        <div className="h-full flex items-center justify-center">
          <CreateServerModal isInitial />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-[#313338]">
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-full mb-8 shadow-md">
          <span className="text-6xl">💬</span>
        </div>

        <h1 className="text-4xl font-extrabold text-zinc-800 dark:text-zinc-200 mb-4">
          Welcome to Discord Clone
        </h1>

        <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-lg">
          Your place to talk, hang out, and have fun.
        </p>

        <div className="mt-8 p-4 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-300 font-medium">
            ⬅️ Select a server from the sidebar to start
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
