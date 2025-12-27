import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteCodeProps {
  params: Promise<{ inviteCode: string }>;
}
const InviteCodePage = async ({ params }: InviteCodeProps) => {
  const profile = await currentProfile();
  if (!profile) throw new Error("Unauthorized");

  const { inviteCode } = await params;

  if (!inviteCode) return redirect("/");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  console.log(`Exist ${existingServer?.id}`);

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const server = await db.server.update({
    where: { inviteCode: inviteCode },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });
  if (server) return redirect(`/servers/${server.id}`);

  return null;
};

export default InviteCodePage;
