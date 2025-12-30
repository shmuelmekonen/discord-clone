import { ChannelType } from "@prisma/client";
import * as z from "zod";

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
    .min(1, {
      message: "Channel name is required.",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'",
    })
    .max(32, { message: "Server name must be 32 characters or less." }),
  type: z.enum(ChannelType),
});

export type ChannelSchemaType = z.infer<typeof channelSchema>;
