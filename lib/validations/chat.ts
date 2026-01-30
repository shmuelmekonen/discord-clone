import * as z from "zod";

export const chatInputSchema = z.object({
  content: z.string().min(1),
  fileUrl: z.string().optional(),
  fileType: z.string().optional(),
});

export const messageFileSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required.",
  }),
  fileType: z.string().optional(),
});

export type ChatInputSchemaType = z.infer<typeof chatInputSchema>;
export type MessageFileSchemaType = z.infer<typeof messageFileSchema>;
