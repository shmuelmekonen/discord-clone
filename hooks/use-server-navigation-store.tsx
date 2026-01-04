import { create } from "zustand";
import { ServerOptimisticAction } from "@/lib/optimistic-reducer";

interface NavigationStore {
  activeAction: ServerOptimisticAction | null;

  dispatchOptimistic: (action: ServerOptimisticAction) => void;
}

export const useServerNavigationStore = create<NavigationStore>((set) => ({
  activeAction: null,
  dispatchOptimistic: (action) => {
    set({ activeAction: action });

    setTimeout(() => set({ activeAction: null }), 0);
  },
}));
