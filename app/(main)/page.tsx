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
    <div className="h-full bg-main">
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="bg-mobile p-6 rounded-full mb-8 shadow-md">
          <span className="text-6xl">💬</span>
        </div>

        <h1 className="text-4xl font-extrabold text-header mb-4">
          Welcome to Discord Clone
        </h1>

        <p className="text-xl text-desc max-w-lg">
          Your place to talk, hang out, and have fun.
        </p>

        <div className="mt-8 p-4 bg-input rounded-lg border border-menu">
          <p className="text-desc font-medium">
            ⬅️ Select a server from the sidebar to start
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
