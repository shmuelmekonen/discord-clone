"use server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";

import { v4 as uuidv4 } from "uuid";

import { revalidatePath } from "next/cache";
import { ACTION_ERRORS, USER_MESSAGES } from "@/lib/constants";

export const updateMemberRole = async (
  serverId: string,
  memberId: string,
  role: MemberRole
) => {
  try {
    const profile = await currentProfile();
    if (!profile) return { data: null, error: USER_MESSAGES.UNAUTHORIZED };

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
      include: {
        members: {
          include: { profile: true },
          orderBy: { role: "asc" },
        },
      },
    });

    revalidatePath(`/servers/${serverId}`);
    return { data: server, error: null };
  } catch (error) {
    console.error("[UPDATE_MEMBER_ROLE_ERROR]", error);
    return { data: null, error: "Failed to update member role" };
  }
};

export const kickMember = async (serverId: string, memberId: string) => {
  try {
    const profile = await currentProfile();
    if (!profile) return { data: null, error: USER_MESSAGES.UNAUTHORIZED };

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
      include: {
        members: {
          include: { profile: true },
          orderBy: { role: "asc" },
        },
      },
    });
    revalidatePath(`/servers/${serverId}`);
    return { data: server, error: null };
  } catch (error) {
    console.error("[KICK_MEMBER_ERROR]", error);
    return { data: null, error: "Failed to kick member" };
  }
};
