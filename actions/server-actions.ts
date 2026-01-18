"use server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole, Server } from "@prisma/client";
import { serverSchema, ServerSchemaType } from "@/lib/validations/server";

import { v4 as uuidv4 } from "uuid";

import { revalidatePath } from "next/cache";
import { ACTION_ERRORS, CHANNEL_NAMES, USER_MESSAGES } from "@/lib/constants";
import {
  ActionResponse,
  JoinServerData,
  LeaveOrDeleteServerResult,
} from "@/types";
import { handleServerActionError } from "@/lib/handle-server-action-error";

export const createServer = async (
  values: ServerSchemaType,
): Promise<ActionResponse<Server>> => {
  try {
    const profile = await currentProfile();
    if (!profile)
      return {
        data: null,
        error: USER_MESSAGES.UNAUTHORIZED,
        code: ACTION_ERRORS.UNAUTHORIZED,
      };

    const validatedData = serverSchema.safeParse(values);
    if (!validatedData.success) {
      return {
        data: null,
        error: USER_MESSAGES.VALIDATION_ERROR,
        code: ACTION_ERRORS.VALIDATION_ERROR,
        validationErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { name, imageUrl } = validatedData.data;

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: CHANNEL_NAMES.GENERAL,
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });

    revalidatePath("/");
    return { data: server, error: null };
  } catch (err) {
    console.error("[CREATE_SERVER_ACTION]", err);
    return handleServerActionError(err);
  }
};

export const renewInviteUrl = async (
  serverId: string,
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

    const updatedServer = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: { inviteCode: uuidv4() },
    });

    revalidatePath(`/servers/${updatedServer.id}`);

    return { data: updatedServer, error: null };
  } catch (err) {
    console.error("[RENEW_INVITE_CODE_ERROR]", err);
    return handleServerActionError(err);
  }
};

export const joinServerWithInviteUrl = async (
  inviteCode: string,
): Promise<ActionResponse<JoinServerData>> => {
  try {
    const profile = await currentProfile();
    if (!profile)
      return {
        data: null,
        error: USER_MESSAGES.UNAUTHORIZED,
        code: ACTION_ERRORS.UNAUTHORIZED,
      };
    if (!inviteCode)
      return {
        data: null,
        error: USER_MESSAGES.GENERIC_ERROR,
        code: ACTION_ERRORS.INVALID_PARAMETERS,
      };
    const existingServer = await db.server.findFirst({
      where: {
        inviteCode,
        members: { some: { profileId: profile.id } },
      },
    });

    if (existingServer) {
      return {
        data: { server: existingServer, joinedNew: false },
        error: null,
      };
    }

    const updatedServer = await db.server.update({
      where: { inviteCode: inviteCode },
      data: {
        members: {
          create: [
            {
              profileId: profile.id,
            },
          ],
        },
      },
    });

    revalidatePath("/");
    revalidatePath(`/servers/${updatedServer.id}`);

    return {
      data: { server: updatedServer, joinedNew: true },
      error: null,
    };
  } catch (err) {
    console.error("[JOIN_SERVER_WITH_INVITE_CODE_ERROR]", err);
    return handleServerActionError(err, {
      notFound: USER_MESSAGES.INVITE_NOT_FOUND,
      conflict: USER_MESSAGES.ALREADY_MEMBER,
    });
  }
};

export const editServer = async (
  serverId: string,
  values: ServerSchemaType,
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

    const validatedData = serverSchema.safeParse(values);
    if (!validatedData.success) {
      return {
        data: null,
        error: USER_MESSAGES.VALIDATION_ERROR,
        code: ACTION_ERRORS.VALIDATION_ERROR,
        validationErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { name, imageUrl } = validatedData.data;

    const editedServer = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: { name, imageUrl },
    });

    revalidatePath(`/servers/${editedServer.id}`);
    revalidatePath("/");

    return { data: editedServer, error: null };
  } catch (err) {
    console.error("[EDIT_SERVER_ERROR]", err);
    return handleServerActionError(err);
  }
};

export const leaveServer = async (
  serverId: string,
): Promise<ActionResponse<LeaveOrDeleteServerResult>> => {
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

    await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: { profileId: profile.id },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    const nextServer = await db.server.findFirst({
      where: { members: { some: { profileId: profile.id } } },
      orderBy: { createdAt: "asc" },
    });

    revalidatePath("/");
    return {
      data: { nextServerId: nextServer?.id || null },
      error: null,
    };
  } catch (err) {
    console.error("[LEAVE_SERVER_ERROR]", err);
    return handleServerActionError(err);
  }
};

export const deleteServer = async (
  serverId: string,
): Promise<ActionResponse<LeaveOrDeleteServerResult>> => {
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

    const server = await db.server.delete({
      where: { id: serverId, profileId: profile.id },
    });

    const nextServer = await db.server.findFirst({
      where: { members: { some: { profileId: profile.id } } },
      orderBy: { createdAt: "asc" },
    });

    revalidatePath("/");
    return { data: { nextServerId: nextServer?.id || null }, error: null };
  } catch (err) {
    console.error("[DELETE_SERVER_ERROR]", err);
    return handleServerActionError(err);
  }
};
