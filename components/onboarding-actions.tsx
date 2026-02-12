"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight, Loader2 } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { MODAL_TYPES } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const OnboardingActions = () => {
  const { onOpen } = useModal();
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode) return;
    if (!inviteCode.toLowerCase().includes("/invite/")) {
      toast.error("Please enter a valid invite link");
      return;
    }
    const splitUrl = inviteCode.split("/invite/");
    if (!splitUrl[1]) return toast.error("Invalid link format.");

    setIsLoading(true);
    router.push(`/invite/${splitUrl[1]}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-[320px] md:max-w-2xl">
      <Card
        role="button"
        onClick={() => onOpen(MODAL_TYPES.CREATE_SERVER)}
        className="group p-6 bg-zinc-100 dark:bg-[#1E1F22] border-none hover:bg-zinc-200 dark:hover:bg-[#2B2D31] transition cursor-pointer flex flex-col items-center justify-center gap-y-3 min-h-[140px]"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500 flex items-center justify-center transition">
          <Plus className="w-6 h-6 text-emerald-500 group-hover:text-white transition" />
        </div>
        <h3 className="font-bold text-base text-header">Create Server</h3>
      </Card>

      <Card className="p-6 bg-zinc-100 dark:bg-[#1E1F22] border-none flex flex-col items-center justify-center gap-y-3 min-h-[140px]">
        <div className="text-center">
          <h3 className="font-bold text-base text-header">Join with Link</h3>
          <p className="text-[9px] text-desc uppercase tracking-widest mt-0.5">
            Invite code
          </p>
        </div>
        <form
          onSubmit={onJoin}
          className="flex items-center w-full gap-x-2 mt-1"
        >
          <Input
            disabled={isLoading}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Invite link..."
            className="bg-main border-0 focus-visible:ring-0 text-header text-xs h-8"
          />
          <Button
            disabled={!inviteCode || isLoading}
            variant="primary"
            size="icon"
            className="h-8 w-8"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <ArrowRight className="w-3 h-3" />
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};
