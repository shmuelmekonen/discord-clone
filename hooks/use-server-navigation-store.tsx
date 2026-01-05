import { create } from "zustand";
import { ServerOptimisticAction } from "@/lib/optimistic-reducer";

interface NavigationStore {
  activeAction: ServerOptimisticAction | null;
  dispatchOptimistic: (action: ServerOptimisticAction) => void;
  clearAction: () => void;
}

export const useServerNavigationStore = create<NavigationStore>((set) => ({
  activeAction: null,
  dispatchOptimistic: (action) => set({ activeAction: action }),
  clearAction: () => set({ activeAction: null }),
}));
