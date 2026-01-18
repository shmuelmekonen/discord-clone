import { ChannelType } from "@prisma/client";
import * as z from "zod";
import { CHANNEL_NAMES } from "../constants";

export const serverSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Server name is required.",
    })
    .max(32, { message: "Server name must be 32 characters or less." }),
  imageUrl: z
    .string()
    .url({
      message: "Invalid image URL",
    })
    .min(1, {
      message: "Server image is required.",
    }),
});

export type ServerSchemaType = z.infer<typeof serverSchema>;

export const channelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Channel name is required." })
    .max(32, { message: "Channel name must be 32 characters or less." })
    .transform((name) => name.toLowerCase().trim().replace(/\s+/g, "-"))
    .pipe(
      z
        .string()
        .refine((name) => name !== CHANNEL_NAMES.GENERAL, {
          message: `Channel name cannot be '${CHANNEL_NAMES.GENERAL}'`,
        })
        .regex(/^[a-z0-9-]+$/, {
          message:
            "Channel name can only contain lowercase letters, numbers, and hyphens.",
        }),
    ),
  type: z.enum([ChannelType.TEXT, ChannelType.AUDIO, ChannelType.VIDEO]),
});

export type ChannelSchemaType = z.infer<typeof channelSchema>;
