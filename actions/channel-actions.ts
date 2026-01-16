"use server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole, Server } from "@prisma/client";
import { channelSchema, ChannelSchemaType } from "@/lib/validations/server";

import { revalidatePath } from "next/cache";
import { ACTION_ERRORS, CHANNEL_NAMES, USER_MESSAGES } from "@/lib/constants";
import { ActionResponse } from "@/types";

export const createChannel = async (
  serverId: string,
  values: ChannelSchemaType
): Promise<ActionResponse<Server>> => {
  try {
    const profile = await currentProfile();
    if (!profile)
      return {
        data: null,
        error: USER_MESSAGES.UNAUTHORIZED,
        code: ACTION_ERRORS.UNAUTHORIZED,
      };

    if (!serverId)
      return {
        data: null,
        error: USER_MESSAGES.GENERIC_ERROR,
        code: ACTION_ERRORS.INVALID_PARAMETERS,
      };

    const validatedData = channelSchema.safeParse(values);
    if (!validatedData.success)
      return {
        data: null,
        error: USER_MESSAGES.VALIDATION_ERROR,
        code: ACTION_ERRORS.VALIDATION_ERROR,
      };

    const { name, type } = validatedData.data;

    const updatedServer = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    revalidatePath(`/servers/${updatedServer.id}`);

    return { data: updatedServer, error: null };
  } catch (err) {
    console.error("[CREATE_CHANNEL_ERROR]", err);
    return {
      data: null,
      error: USER_MESSAGES.GENERIC_ERROR,
      code: ACTION_ERRORS.INTERNAL_ERROR,
    };
  }
};

type ChannelResult = {
  updatedServerId: string | null;
};

export const deleteChannel = async (
  channelId: string,
  serverId: string
): Promise<ActionResponse<ChannelResult>> => {
  try {
    const profile = await currentProfile();
    if (!profile)
      return {
        data: null,
        error: USER_MESSAGES.UNAUTHORIZED,
        code: ACTION_ERRORS.UNAUTHORIZED,
      };

    if (!serverId || !channelId)
      return {
        data: null,
        error: USER_MESSAGES.GENERIC_ERROR,
        code: ACTION_ERRORS.INVALID_PARAMETERS,
      };

    const updatedServer = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          deleteMany: {
            id: channelId,
            name: {
              not: CHANNEL_NAMES.GENERAL,
            },
          },
        },
      },
    });

    revalidatePath(`/servers/${updatedServer.id}`);

    return { data: { updatedServerId: serverId }, error: null };
  } catch (err) {
    console.error("[DELETE_CHANNEL_ERROR]", err);
    return {
      data: null,
      error: USER_MESSAGES.GENERIC_ERROR,
      code: ACTION_ERRORS.INTERNAL_ERROR,
    };
  }
};

export const editChannel = async (
  serverId: string,
  channelId: string,
  values: ChannelSchemaType
): Promise<ActionResponse<ChannelResult>> => {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return {
        data: null,
        error: USER_MESSAGES.UNAUTHORIZED,
        code: ACTION_ERRORS.UNAUTHORIZED,
      };
    }

    if (!serverId || !channelId) {
      return {
        data: null,
        error: USER_MESSAGES.GENERIC_ERROR,
        code: ACTION_ERRORS.INVALID_PARAMETERS,
      };
    }

    const validatedData = channelSchema.safeParse(values);
    if (!validatedData.success)
      return {
        data: null,
        error: USER_MESSAGES.VALIDATION_ERROR,
        code: ACTION_ERRORS.VALIDATION_ERROR,
      };

    const { name, type } = validatedData.data;

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: CHANNEL_NAMES.GENERAL,
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });
    revalidatePath(`/servers/${serverId}`);
    return { data: { updatedServerId: serverId }, error: null };
  } catch (err) {
    console.error("[EDIT_CHANNEL_ERROR]", err);
    return {
      data: null,
      error: USER_MESSAGES.GENERIC_ERROR,
      code: ACTION_ERRORS.INTERNAL_ERROR,
    };
  }
};
