import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

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

  // אם נמצא שרת, נעבור אליו
  if (server) return redirect(`/servers/${server.id}`);

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>

      <main className="md:pl-[72px] h-full flex items-center justify-center">
        <CreateServerModal isInitial />
      </main>
    </div>
  );
};

export default SetupPage;
