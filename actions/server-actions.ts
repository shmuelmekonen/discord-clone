"use server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole, Server } from "@prisma/client";
import { serverSchema, ServerSchemaType } from "@/lib/validations/server";

import { v4 as uuidv4 } from "uuid";

import { revalidatePath } from "next/cache";

export const createServer = async (values: ServerSchemaType) => {
  try {
    const validatedData = serverSchema.parse(values);

    const profile = await currentProfile();
    if (!profile) return { data: null, error: "Unauthorized" };

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name: validatedData.name,
        imageUrl: validatedData.imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: "general",
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
  } catch (error) {
    console.error("[CREATE_SERVER_ACTION]", error);
    return { data: null, error: "Failed to create server" };
  }
};

export const renewInviteUrl = async (serverId: string) => {
  try {
    const profile = await currentProfile();
    if (!profile) return { data: null, error: "Unauthorized" };

    const updatedServer = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: { inviteCode: uuidv4() },
    });

    revalidatePath(`/servers/${updatedServer.id}`);

    return { data: updatedServer, error: null };
  } catch (error) {
    console.error("[RENEW_INVITE_CODE_ERROR]", error);
    return { data: null, error: "Failed to renew invite link" };
  }
};

export const joinServerWithInviteUrl = async (inviteCode: string) => {
  try {
    const profile = await currentProfile();
    if (!profile)
      return { data: null, error: "Unauthorized", joinedNew: false };

    const existingServer = await db.server.findFirst({
      where: {
        inviteCode,
        members: { some: { profileId: profile.id } },
      },
    });

    if (existingServer)
      return { data: existingServer, error: null, joinedNew: false };

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

    if (!updatedServer) return { data: null, error: "Something went wrong" };
    revalidatePath(`/servers/${updatedServer.id}`);
    revalidatePath("/");

    return { data: updatedServer, error: null, joinedNew: true };
  } catch (error) {
    console.error("[JOIN_SERVER_WITH_INVITE_CODE_ERROR]", error);
    return { data: null, error: "Failed to join server", joinedNew: false };
  }
};
