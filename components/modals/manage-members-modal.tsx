"use client";

import { startTransition, useOptimistic, useState } from "react";
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

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

type MemberWithProfile = Member & {
  profile: {
    name: string;
    imageUrl: string;
    email: string;
  };
};

export type OptimisticAction =
  | { type: "KICK"; id: string }
  | { type: "MODIFY_ROLE"; id: string; role: MemberRole };

export const memberReducer = (
  state: MemberWithProfile[],
  action: OptimisticAction
): MemberWithProfile[] => {
  switch (action.type) {
    case "KICK":
      return state.filter((member) => member.id !== action.id);

    case "MODIFY_ROLE":
      return state.map((member) =>
        member.id === action.id ? { ...member, role: action.role } : member
      );

    default:
      return state;
  }
};

export const ManageMembersModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const [optimisticMembers, updateMembers] = useOptimistic(
    (server?.members as MemberWithProfile[]) || [],
    memberReducer
  );

  const [loadingId, setLoadingId] = useState("");

  const [generalError, setGeneralError] = useState<string | null>(null);

  const isModalOpen = isOpen && type === "manageMembers";

  const onRoleChanged = async (memberId: string, role: MemberRole) => {
    startTransition(async () => {
      try {
        updateMembers({ type: "MODIFY_ROLE", id: memberId, role });

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
      }
    });
  };

  const onKick = async (memberId: string) => {
    startTransition(async () => {
      try {
        updateMembers({ type: "KICK", id: memberId });

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
          {optimisticMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                        <DropdownMenuContent side="right">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="w-4 h-4 mr-2 " />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChanged(member.id, "GUEST")
                                  }
                                  className={cn(
                                    member.role === "GUEST" &&
                                      "opacity-45 pointer-events-none"
                                  )}
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
                                  className={cn(
                                    member.role === "MODERATOR" &&
                                      "opacity-45 pointer-events-none"
                                  )}
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
                      </DropdownMenuTrigger>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
        {generalError && (
          <div className="mx-6 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600 text-center">
            {generalError}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
