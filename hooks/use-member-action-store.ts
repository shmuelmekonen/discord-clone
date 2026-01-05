import { create } from "zustand";
import { MemberOptimisticAction } from "@/lib/optimistic-reducer";

interface MemberActionStore {
  activeMemberActions: Record<string, MemberOptimisticAction>;
  dispatchMemberOptimistic: (
    id: string,
    action: MemberOptimisticAction
  ) => void;
  clearMemberAction: (id: string) => void;
}

export const useMemberActionStore = create<MemberActionStore>((set) => ({
  activeMemberActions: {},
  dispatchMemberOptimistic: (id, action) =>
    set((state) => ({
      activeMemberActions: { ...state.activeMemberActions, [id]: action },
    })),
  clearMemberAction: (id) =>
    set((state) => {
      const next = { ...state.activeMemberActions };
      delete next[id];
      return { activeMemberActions: next };
    }),
}));
