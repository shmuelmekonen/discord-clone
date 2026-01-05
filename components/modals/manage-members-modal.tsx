"use client";

import { startTransition, useEffect, useOptimistic, useState } from "react";
import { ServerWithMembersWithProfiles } from "@/Types";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";

import { useModal } from "@/hooks/use-modal-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Member, MemberRole } from "@prisma/client";

import { kickMember, updateMemberRole } from "@/actions/server-actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { membersReducer, MemberWithProfile } from "@/lib/optimistic-reducer";
import { useMemberActionStore } from "@/hooks/use-member-action-store";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export const ManageMembersModal = () => {
  const { activeMemberActions, dispatchMemberOptimistic, clearMemberAction } =
    useMemberActionStore();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const [optimisticMembers, updateMembers] = useOptimistic(
    (server?.members as MemberWithProfile[]) || [],
    membersReducer
  );

  const isModalOpen = isOpen && type === "manageMembers";

  useEffect(() => {
    startTransition(() => {
      updateMembers(activeMemberActions);
    });
  }, [activeMemberActions, updateMembers]);

  const onRoleChanged = async (memberId: string, role: MemberRole) => {
    startTransition(async () => {
      try {
        dispatchMemberOptimistic(memberId, {
          type: "MODIFY_ROLE",
          id: memberId,
          role,
        });

        const { data: updatedServer, error } = await updateMemberRole(
          server.id,
          memberId,
          role
        );

        if (error) {
          toast.error(error);
          return;
        }

        if (updatedServer) {
          onOpen("manageMembers", { server: updatedServer });
        }
      } catch (error) {
        toast.error("Failed to update role");
      } finally {
        clearMemberAction(memberId);
      }
    });
  };

  const onKick = async (memberId: string) => {
    startTransition(async () => {
      try {
        dispatchMemberOptimistic(memberId, { type: "KICK", id: memberId });

        const { data: updatedServer, error } = await kickMember(
          server.id,
          memberId
        );

        if (error) {
          toast.error(error);
          return;
        }
        if (updatedServer) {
          onOpen("manageMembers", { server: updatedServer });
        }
      } catch (error) {
        toast.error("Failed to kick member");
      } finally {
        clearMemberAction(memberId);
      }
    });
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-8 max-h-60 pr-6">
          {optimisticMembers.map((member) => {
            const isPending = !!activeMemberActions[member.id];

            return (
              <div
                key={member.id}
                className={cn(
                  "flex items-center gap-x-2 mb-6 transition",
                  isPending && "opacity-50 pointer-events-none" // חסימת אינטראקציה בזמן טעינה
                )}
              >
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gap-y-1">
                  <div className="text-xs font-semibold flex items-center gap-x-1">
                    {member.profile.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {member.profile.email}
                  </p>
                </div>

                {/* לוגיקת כפתורים מול לואדר */}
                <div className="ml-auto flex items-center">
                  {isPending ? (
                    <Loader2 className="animate-spin text-zinc-500 w-4 h-4" />
                  ) : (
                    // הצגת דרופדאון רק אם זה לא האדמין ולא בטעינה
                    server.profileId !== member.profileId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4 text-zinc-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="w-4 h-4 mr-2" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChanged(member.id, "GUEST")
                                  }
                                  disabled={member.role === "GUEST"}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Guest
                                  {member.role === "GUEST" && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChanged(member.id, "MODERATOR")
                                  }
                                  disabled={member.role === "MODERATOR"}
                                >
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Moderator
                                  {member.role === "MODERATOR" && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onKick(member.id)}>
                            <Gavel className="h-4 w-4 mr-2" />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
