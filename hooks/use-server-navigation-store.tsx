import { create } from "zustand";
import { OptimisticAction } from "@/lib/optimistic-reducer";

interface NavigationStore {
  activeAction: OptimisticAction | null;

  dispatchOptimistic: (action: OptimisticAction) => void;
}

export const useServerNavigationStore = create<NavigationStore>((set) => ({
  activeAction: null,
  dispatchOptimistic: (action) => {
    set({ activeAction: action });

    setTimeout(() => set({ activeAction: null }), 0);
  },
}));
