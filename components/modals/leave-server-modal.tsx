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
import { useRouter } from "next/navigation";
import { leaveServer } from "@/actions/server-actions";

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const [generalError, setGeneralError] = useState<string | null>(null);

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onClick = async () => {
    try {
      setGeneralError(null);
      setIsLoading(true);

      const serverId = server?.id;
      if (!serverId) {
        setGeneralError("An unexpected error occurred.");
        return;
      }
      const { data, error } = await leaveServer(serverId);

      if (error) {
        setGeneralError(error);
        return;
      }

      if (!data) {
        setGeneralError("An unexpected error occurred.");
        return;
      }

      onClose();
      toast.success("you left the server");
      router.refresh();
      router.push("/");
    } catch (error) {
      setGeneralError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
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
        {generalError && (
          <div className="mx-6 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600 text-center">
            {generalError}
          </div>
        )}
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} variant="primary" onClick={onClick}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
