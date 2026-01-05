import { create } from "zustand";
import { ServerOptimisticAction } from "@/lib/optimistic-reducer";

interface NavigationStore {
  activeActions: Record<string, ServerOptimisticAction>;
  dispatchOptimistic: (id: string, action: ServerOptimisticAction) => void;
  clearAction: (id: string) => void;
}

export const useServerNavigationStore = create<NavigationStore>((set) => ({
  activeActions: {},
  dispatchOptimistic: (id, action) =>
    set((state) => ({
      activeActions: { ...state.activeActions, [id]: action },
    })),
  clearAction: (id) =>
    set((state) => {
      const next = { ...state.activeActions };
      delete next[id];
      return { activeActions: next };
    }),
}));
