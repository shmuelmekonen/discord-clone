import { Member, MemberRole, Server } from "@prisma/client";
import { OPTIMISTIC_ACTIONS } from "./constants";

export type ServerOptimisticAction =
  | { type: typeof OPTIMISTIC_ACTIONS.REMOVE; id: string }
  | { type: typeof OPTIMISTIC_ACTIONS.UPDATE; server: Server }
  | { type: typeof OPTIMISTIC_ACTIONS.CREATE; server: Server };

export const serversReducer = (
  state: Server[],
  actions: Record<string, ServerOptimisticAction>
): Server[] => {
  let result = [...state];

  Object.values(actions).forEach((action) => {
    switch (action.type) {
      case OPTIMISTIC_ACTIONS.REMOVE:
        result = result.filter((s) => s.id !== action.id);
        break;
      case OPTIMISTIC_ACTIONS.UPDATE:
        result = result.map((s) =>
          s.id === action.server.id ? action.server : s
        );
        break;
      case OPTIMISTIC_ACTIONS.CREATE:
        if (!result.find((s) => s.id === action.server.id)) {
          result = [...result, action.server];
        }
        break;
    }
  });

  return result;
};

export type MemberWithProfile = Member & {
  profile: {
    name: string;
    imageUrl: string;
    email: string;
  };
};
export type MemberOptimisticAction =
  | { type: "KICK"; id: string }
  | { type: "MODIFY_ROLE"; id: string; role: MemberRole };

export const membersReducer = (
  state: MemberWithProfile[],
  actions: Record<string, MemberOptimisticAction>
): MemberWithProfile[] => {
  let result = [...state];

  Object.values(actions).forEach((action) => {
    switch (action.type) {
      case "KICK":
        result = result.filter((member) => member.id !== action.id);
        break;
      case "MODIFY_ROLE":
        result = result.map((member) =>
          member.id === action.id ? { ...member, role: action.role } : member
        );
        break;
    }
  });

  return result;
};
