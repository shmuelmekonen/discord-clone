import * as z from "zod";

export const chatInputSchema = z.object({
  content: z.string().min(1),
});

export const messageFileSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required.",
  }),
});

export type ChatInputSchemaType = z.infer<typeof chatInputSchema>;
export type MessageFileSchemaType = z.infer<typeof messageFileSchema>;
