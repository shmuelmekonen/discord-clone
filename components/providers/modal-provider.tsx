"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { ManageMembersModal } from "@/components/modals/manage-members-modal";
import { CreateChennelModal } from "@/components/modals/create-channel-modal";
import { LeaveServerModal } from "@/components/modals/leave-server-modal";
import { DeleteServerModal } from "../modals/delete-server-modal";

interface ModalProviderProps {
  profileId?: string;
}

export const ModalProvider = ({ profileId }: ModalProviderProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal profileId={profileId} />
      <InviteModal />
      <EditServerModal />
      <ManageMembersModal />
      <CreateChennelModal />
      <LeaveServerModal />
      <DeleteServerModal />
    </>
  );
};
