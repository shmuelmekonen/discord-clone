"use client";

import { startTransition, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MODAL_TYPES } from "@/lib/constants";
import { deleteChannel } from "@/actions/channel-actions";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === MODAL_TYPES.DELETE_CHANNEL;
  const { server, channel } = data;

  const router = useRouter();

  const onClick = async () => {
    const serverId = server?.id;
    const channelId = channel?.id;
    if (!serverId || !channelId) {
      return;
    }
    startTransition(async () => {
      try {
        const { data, error } = await deleteChannel(channelId, serverId);

        if (error) {
          toast.error(error);
          return;
        }
        onClose();

        router.push(
          data?.updatedServerId ? `/servers/${data.updatedServerId}` : "/"
        );
      } catch (err) {
        toast.error("Failed to delete channel");
      }
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete <br />
            <span className="font-semibold text-indigo-500">
              #{channel?.name}
            </span>{" "}
            will be permanently{" "}
            <span className="font-bold text-rose-500">deleted</span> ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button variant="primary" onClick={onClick}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
