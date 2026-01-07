import { ACTION_ERRORS } from "@/lib/constants";
import { Server, Member, Profile } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};
export type ActionErrorCode =
  (typeof ACTION_ERRORS)[keyof typeof ACTION_ERRORS];

export type ActionResponse<T> = {
  data: T | null;
  error: string | null;
  code?: ActionErrorCode;
};
