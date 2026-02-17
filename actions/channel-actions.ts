"use server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole, Server } from "@prisma/client";
import { channelSchema, ChannelSchemaType } from "@/lib/validations/server";

import { revalidatePath } from "next/cache";
import { ACTION_ERRORS, CHANNEL_NAMES, USER_MESSAGES } from "@/lib/constants";
import { ActionResponse, ChannelResult } from "@/types";
import { handleServerActionError } from "@/lib/handle-server-action-error";

export const createChannel = async (
  serverId: string,
  values: ChannelSchemaType,
): Promise<ActionResponse<ChannelResult>> => {
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

    const updatedServer = await db.server.findUnique({
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
    });

    if (!updatedServer) {
      return {
        data: null,
        error: USER_MESSAGES.UNAUTHORIZED,
        code: ACTION_ERRORS.UNAUTHORIZED,
      };
    }

    const channel = await db.channel.create({
      data: {
        profileId: profile.id,
        serverId: serverId,
        name,
        type,
      },
    });

    revalidatePath(`/servers/${updatedServer.id}`);

    return {
      data: { updatedServerId: updatedServer.id, channelId: channel.id },
      error: null,
    };
  } catch (err) {
    console.error("[CREATE_CHANNEL_ERROR]", err);
    return handleServerActionError(err);
  }
};

export const deleteChannel = async (
  channelId: string,
  serverId: string,
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
    return handleServerActionError(err);
  }
};

export const editChannel = async (
  serverId: string,
  channelId: string,
  values: ChannelSchemaType,
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

    await db.server.update({
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
    return handleServerActionError(err);
  }
};
