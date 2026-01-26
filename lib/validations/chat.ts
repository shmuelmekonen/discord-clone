import * as z from "zod";

export const chatInputSchema = z.object({
  content: z.string().min(1),
});

export type ChatInputSchemaType = z.infer<typeof chatInputSchema>;
