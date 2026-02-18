"use client";

import { useState } from "react";

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
import { leaveServer } from "@/actions/server-actions";
import { MODAL_TYPES, TOAST_MESSAGES } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { SOCKET_EVENTS } from "@/lib/routes";

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === MODAL_TYPES.LEAVE_SERVER;
  const { server } = data;

  const onClick = async () => {
    const serverId = server?.id;
    if (!serverId) return;

    try {
      setIsLoading(true);
      const result = await leaveServer(serverId);
      const { data, error } = result;

      if (error || !data) {
        toast.error(error || TOAST_MESSAGES.SERVER.LEAVE_ERROR);
        return;
      }

      const { nextServerId } = data;

      try {
        await fetch("/api/socket/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serverId: serverId,
            event: SOCKET_EVENTS.SERVER_UPDATE,
          }),
          keepalive: true,
        });
      } catch (error) {
        console.error("REALTIME_SIGNAL_ERROR", error);
      }

      onClose();
      window.location.assign(nextServerId ? `/servers/${nextServerId}` : "/");

      toast.success(TOAST_MESSAGES.SERVER.LEAVE_SUCCESS);
    } catch (err) {
      console.log(err);
      toast.error(TOAST_MESSAGES.SERVER.LEAVE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden w-[95vw] max-w-[425px]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-200 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} variant="primary" onClick={onClick}>
              {isLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
