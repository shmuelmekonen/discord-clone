import { redirect } from "next/navigation";

import JoinServerModal from "@/components/modals/join-server-modal";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    select: { id: true, name: true, imageUrl: true, profileId: true },
  });

  if (!server) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#313338] gap-y-4">
        <h1 className="text-2xl font-bold text-white">Invalid Invite</h1>
        <p className="text-zinc-400">
          The invite link is invalid or has expired.
        </p>
        <Button asChild variant="primary">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    );
  }
  const isMember = await db.member.findFirst({
    where: { serverId: server.id, profileId: profile.id },
  });

  if (isMember) return redirect(`/servers/${server.id}`);

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#1E1F22]">
      <JoinServerModal
        server={server}
        inviteCode={inviteCode}
        profileId={profile.id}
      />
    </div>
  );
};

export default InviteCodePage;
