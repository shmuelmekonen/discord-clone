import { Server } from "@prisma/client";

export type OptimisticAction =
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE"; server: Server }
  | { type: "CREATE"; server: Server };

// הפונקציה שמחשבת את המצב החדש
export const serversReducer = (
  state: Server[],
  action: OptimisticAction
): Server[] => {
  switch (action.type) {
    case "REMOVE":
      return state.filter((s) => s.id !== action.id);

    case "UPDATE":
      return state.map((s) => (s.id === action.server.id ? action.server : s));

    case "CREATE":
      return [...state, action.server];

    default:
      return state;
  }
};
