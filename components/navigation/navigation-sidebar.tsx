import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { NavigationAction } from "@/components/navigation/navigation-action";
import { NavigationList } from "@/components/navigation/navigation-list";
import { NavigationFriendsAction } from "@/components/navigation/navigation-friends-action";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const servers = await db.server.findMany({
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

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-mobile py-3">
      <NavigationAction />
      <Separator className="h-0.5 bg-menu rounded-md w-10 mx-auto" />
      <NavigationFriendsAction />
      <Separator className="h-0.5 bg-menu rounded-md w-10 mx-auto" />
      <NavigationList servers={servers} />
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};
