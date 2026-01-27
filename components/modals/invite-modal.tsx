"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components//ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import { renewInviteUrl } from "@/actions/server-actions";
import { cn } from "@/lib/utils";
import { MODAL_TYPES } from "@/lib/constants";

export const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const [generalError, setGeneralError] = useState<string | null>(null);

  const isModalOpen = isOpen && type === MODAL_TYPES.INVITE;
  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setGeneralError(null);

      if (!server) {
        setGeneralError("An unexpected error occurred.");
        return;
      }
      setIsLoading(true);
      const { data: updatedServer, error } = await renewInviteUrl(server.id);

      if (error) {
        setGeneralError(`${error}`);
        return;
      }
      if (updatedServer) {
        onOpen(MODAL_TYPES.INVITE, { server: updatedServer });
      }
    } catch (err) {
      console.log(err);
      setGeneralError("Failed to new generate link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 ">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              readOnly
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              placeholder="Generating link..."
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new link
            <RefreshCw
              className={cn("w-4 h-4 ml-2", isLoading && "animate-spin")}
            />
          </Button>
          {generalError && (
            <div className="mx-6 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600 text-center">
              {generalError}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
