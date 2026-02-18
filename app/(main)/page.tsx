import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import MobileToggle from "@/components/mobile-toggle";
import { InitialDashboard } from "@/components/initial-dashboard";

export const dynamic = "force-dynamic";

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
  if (!server) return <InitialDashboard />;

  return (
    <div className="h-full bg-main flex flex-col">
      <div className="md:hidden flex items-center px-3 h-14 border-b-2 border-menu bg-main shrink-0">
        <MobileToggle />
        <span className="ml-2 font-bold text-header text-sm">Nexus</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="bg-zinc-200 dark:bg-[#2B2D31] p-5 md:p-6 rounded-full shadow-sm">
            <span className="text-5xl md:text-6xl">💬</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-extrabold text-header tracking-tight">
              Welcome back, {profile.name.split(" ")[0]}
            </h1>
            <p className="text-sm md:text-lg text-desc leading-relaxed">
              Ready to jump back into the conversation?
            </p>
          </div>

          <div className="w-full p-6 bg-zinc-100 dark:bg-[#1E1F22] rounded-2xl border-2 border-menu shadow-sm">
            <p className="text-desc font-medium text-sm md:text-base leading-relaxed">
              <span className="hidden md:inline">
                ⬅️ Select a server from the sidebar on the left to start
                chatting.
              </span>
              <span className="md:hidden">
                Tap the <strong>Menu icon (☰)</strong> at the top left to
                switch servers.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
