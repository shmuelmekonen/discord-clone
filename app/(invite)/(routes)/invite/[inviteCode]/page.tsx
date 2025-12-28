import { redirect } from "next/navigation";

import JoinServerModal from "@/components/modals/join-server-modal";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface InviteCodeProps {
  params: Promise<{ inviteCode: string }>;
}
const InviteCodePage = async ({ params }: InviteCodeProps) => {
  const profile = await currentProfile();
  if (!profile) return redirect("/sign-in");

  const { inviteCode } = await params;
  if (!inviteCode) return redirect("/");

  const server = await db.server.findUnique({
    where: { inviteCode },
    select: { name: true, imageUrl: true, id: true },
  });

  if (!server) return redirect("/");

  const isMember = await db.member.findFirst({
    where: { serverId: server.id, profileId: profile.id },
  });

  if (isMember) return redirect(`/servers/${server.id}`);

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#1E1F22]">
      <JoinServerModal
        serverName={server.name}
        serverImage={server.imageUrl}
        inviteCode={inviteCode}
      />
    </div>
  );
};

export default InviteCodePage;
