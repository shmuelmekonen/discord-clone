import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerIDPageProps {
  params: Promise<{
    serverId: string;
  }>;
}
const ServerIDPage = async ({ params }: ServerIDPageProps) => {
  const profile = await currentProfile();
  // TODO: Fix redirect to sign-in handler.
  if (!profile) redirect("/sign-in");

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
    include: {
      channels: {
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (!server || !initialChannel) {
    return redirect("/");
  }

  return redirect(`/servers/${serverId}/channels/${initialChannel.id}`);
};

export default ServerIDPage;
