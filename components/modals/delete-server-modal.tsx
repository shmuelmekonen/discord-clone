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
import { deleteServer } from "@/actions/server-actions";
import { useServerNavigationStore } from "@/hooks/use-server-navigation-store";

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { dispatchOptimistic } = useServerNavigationStore();

  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data;

  const router = useRouter();

  const onClick = async () => {
    const serverId = server?.id;
    if (!serverId) {
      return;
    }
    startTransition(async () => {
      try {
        dispatchOptimistic({ type: "REMOVE", id: serverId });
        onClose();

        const { data, error } = await deleteServer(serverId);

        if (error) {
          toast.error(error);
          return;
        }

        if (data?.nextServerId) {
          router.push(`/servers/${data.nextServerId}`);
        } else {
          router.push("/");
        }
      } catch (error) {
        toast.error("Failed to delete server");
      }
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete <br />
            <span className="font-semibold text-indigo-500">
              {server?.name}
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
