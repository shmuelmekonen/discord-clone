import { Member, MemberRole, Server } from "@prisma/client";

export type ServerOptimisticAction =
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE"; server: Server }
  | { type: "CREATE"; server: Server };

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

export const serversReducer = (
  state: Server[],
  action: ServerOptimisticAction
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

export const membersReducer = (
  state: MemberWithProfile[],
  action: MemberOptimisticAction
): MemberWithProfile[] => {
  switch (action.type) {
    case "KICK":
      return state.filter((member) => member.id !== action.id);
    case "MODIFY_ROLE":
      return state.map((member) =>
        member.id === action.id ? { ...member, role: action.role } : member
      );
    default:
      return state;
  }
};
