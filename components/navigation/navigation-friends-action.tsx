"use client";

import { Users } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";

// TODO: Future Implementation
// Currently UI only. In the future:
// onClick will trigger router.push('/me') or '/friends',
// rendering a separate component for the friends list.

export const NavigationFriendsAction = () => {
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Friends">
        <button
          className="group flex items-center"
          onClick={() => {}} // TODO: Add navigation logic later
        >
          <div
            className={cn(
              "flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px]",
              "transition-all overflow-hidden items-center justify-center",
              "bg-indigo-700",
              "shadow-sm group-hover:shadow-xl",
            )}
          >
            <Users className="text-white" size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
