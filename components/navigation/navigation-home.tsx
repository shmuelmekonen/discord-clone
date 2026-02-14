"use client";

import { Home } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";

export const NavigationHome = () => {
  const pathname = usePathname();
  const router = useRouter();

  const onClick = () => {
    router.push("/");
  };

  const isActive = pathname === "/";

  const baseClasses =
    "flex mx-3 h-[48px] w-[48px] transition-all overflow-hidden items-center justify-center";

  const stateClasses = isActive
    ? "bg-indigo-500 rounded-[16px]"
    : "bg-zinc-200 dark:bg-zinc-700 rounded-[24px] group-hover:bg-indigo-500 dark:group-hover:bg-indigo-500 group-hover:rounded-[16px]"; // מצב רגיל: אפור ועיגול -> משתנה בהובר

  const iconClasses = isActive
    ? "text-white"
    : "text-primary group-hover:text-white";

  return (
    <div>
      <ActionTooltip side="right" align="center" label="Home">
        <button onClick={onClick} className="group flex items-center">
          <div className={cn(baseClasses, stateClasses)}>
            <Home className={cn("transition", iconClasses)} size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
