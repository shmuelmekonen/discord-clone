"use server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { Server, MemberRole } from "@prisma/client";

import { revalidatePath } from "next/cache";
import { ACTION_ERRORS, USER_MESSAGES } from "@/lib/constants";
import { ActionResponse } from "@/types";

export const updateMemberRole = async (
  serverId: string,
  memberId: string,
  role: MemberRole
): Promise<ActionResponse<Server>> => {
  try {
    const profile = await currentProfile();
    if (!profile)
      return {
        data: null,
        error: USER_MESSAGES.UNAUTHORIZED,
        code: ACTION_ERRORS.UNAUTHORIZED,
      };

    if (!serverId || !memberId)
      return {
        data: null,
        error: USER_MESSAGES.GENERIC_ERROR,
        code: ACTION_ERRORS.INVALID_PARAMETERS,
      };

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: { role },
          },
        },
      },
      // include: {
      //   members: {
      //     include: { profile: true },
      //     orderBy: { role: "asc" },
      //   },
      // },
    });

    revalidatePath(`/servers/${serverId}`);
    return { data: server, error: null };
  } catch (err) {
    console.error("[UPDATE_MEMBER_ROLE_ERROR]", err);
    return {
      data: null,
      error: USER_MESSAGES.GENERIC_ERROR,
      code: ACTION_ERRORS.INTERNAL_ERROR,
    };
  }
};

export const kickMember = async (
  serverId: string,
  memberId: string
): Promise<ActionResponse<Server>> => {
  try {
    const profile = await currentProfile();
    if (!profile)
      return {
        data: null,
        error: USER_MESSAGES.UNAUTHORIZED,
        code: ACTION_ERRORS.UNAUTHORIZED,
      };

    if (!serverId || !memberId)
      return {
        data: null,
        error: USER_MESSAGES.GENERIC_ERROR,
        code: ACTION_ERRORS.INVALID_PARAMETERS,
      };

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: { not: profile.id },
          },
        },
      },
      // include: {
      //   members: {
      //     include: { profile: true },
      //     orderBy: { role: "asc" },
      //   },
      // },
    });
    revalidatePath(`/servers/${serverId}`);
    return { data: server, error: null };
  } catch (err) {
    console.error("[KICK_MEMBER_ERROR]", err);
    return {
      data: null,
      error: USER_MESSAGES.GENERIC_ERROR,
      code: ACTION_ERRORS.INTERNAL_ERROR,
    };
  }
};
