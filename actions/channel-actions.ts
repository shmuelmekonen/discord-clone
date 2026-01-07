"use server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";
import { channelSchema, ChannelSchemaType } from "@/lib/validations/server";

import { v4 as uuidv4 } from "uuid";

import { revalidatePath } from "next/cache";

export const createChannel = async (
  serverId: string,
  values: ChannelSchemaType
) => {
  try {
    const profile = await currentProfile();
    if (!profile) return { data: null, error: "Unauthorized" };

    if (!serverId) return { data: null, error: "Server Id missing" };

    const validatedData = channelSchema.safeParse(values);
    if (!validatedData.success)
      return { data: null, error: "Invalid data provided" };

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

    if (!updatedServer)
      return { data: null, error: "An unexpected error occurred." };

    revalidatePath(`/servers/${updatedServer.id}`);

    return { data: updatedServer, error: null };
  } catch (error) {
    console.error("[CREATE_CHANNEL_ERROR]", error);
    return { data: null, error: "Failed to create channel" };
  }
};
