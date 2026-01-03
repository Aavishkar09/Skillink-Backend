import { z } from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1).max(1000),
});