import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import MobileToggle from "@/components/mobile-toggle";

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
    <div className="h-full bg-main relative">
      <div className="md:hidden flex items-center p-4 absolute top-0 left-0 w-full z-50">
        <MobileToggle serverId={server.id} />
      </div>
      <div className="h-full bg-main">
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="bg-mobile p-4 md:p-6 rounded-full mb-6 md:mb-8 shadow-md">
            <span className="text-4xl md:text-6xl">💬</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-header mb-2 md:mb-4 px-4">
            Welcome to Discord Clone
          </h1>

          <p className="text-base md:text-xl text-desc max-w-lg px-6">
            Your place to talk, hang out, and have fun.
          </p>

          <div className="mt-6 md:mt-8 p-3 md:p-4 bg-input rounded-lg border border-menu">
            <p className="text-desc font-medium text-sm md:text-base">
              ⬅️ Select a server from the sidebar to start
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
