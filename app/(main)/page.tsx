import { redirect } from "next/navigation";
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

  // אם נמצא שרת, נעבור אליו
  if (server) return redirect(`/servers/${server.id}`);

  // אם אין שרת, נשאר בכתובת "/" ונציג את המודאל
  // המודאל יופיע לצד ה-NavigationSidebar הריק
  return (
    <div className="h-full flex items-center justify-center">
      <CreateServerModal isInitial profileId={profile.id} />
    </div>
  );
};

export default SetupPage;
