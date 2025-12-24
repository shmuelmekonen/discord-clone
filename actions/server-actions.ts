"use server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";
import { serverSchema, ServerSchemaType } from "@/lib/validations/server";

import { v4 as uuidv4 } from "uuid";

import { revalidatePath } from "next/cache";

export const createServer = async (values: ServerSchemaType) => {
  try {
    const validatedData = serverSchema.parse(values);

    const profile = await currentProfile();
    if (!profile) throw new Error("Unauhorized");

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
    return { data: server };
  } catch (error) {
    console.error("[CREATE_SERVER_ACTION]", error);
    return { error: "Failed to create server" };
  }
};
