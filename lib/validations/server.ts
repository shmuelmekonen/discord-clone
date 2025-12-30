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
