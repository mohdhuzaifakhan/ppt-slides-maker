import { z } from "zod";

// Chat Message Schema
export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
});

export type Message = z.infer<typeof messageSchema>;

// Slide Schema
export const slideSchema = z.object({
  id: z.string(),
  type: z.enum(["title", "content", "section"]),
  title: z.string(),
  content: z.array(z.string()).optional(),
  subtitle: z.string().optional(),
});

export type Slide = z.infer<typeof slideSchema>;

// Presentation Schema
export const presentationSchema = z.object({
  id: z.string(),
  title: z.string(),
  slides: z.array(slideSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Presentation = z.infer<typeof presentationSchema>;

// Chat Session Schema
export const chatSessionSchema = z.object({
  id: z.string(),
  messages: z.array(messageSchema),
  presentation: presentationSchema.nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type ChatSession = z.infer<typeof chatSessionSchema>;

// API Request/Response Schemas
export const generateSlidesRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  sessionId: z.string().optional(),
});

export type GenerateSlidesRequest = z.infer<typeof generateSlidesRequestSchema>;

export const generateSlidesResponseSchema = z.object({
  presentation: presentationSchema,
  message: messageSchema,
  sessionId: z.string(),
});

export type GenerateSlidesResponse = z.infer<typeof generateSlidesResponseSchema>;

export const updateSlidesRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  sessionId: z.string(),
  slideIndex: z.number().optional(),
});

export type UpdateSlidesRequest = z.infer<typeof updateSlidesRequestSchema>;
