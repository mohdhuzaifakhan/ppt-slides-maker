import { z } from "zod";

// Chat Message Schema
export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
});

export type Message = z.infer<typeof messageSchema>;

// Enhanced Slide Schema with image support
export const slideSchema = z.object({
  id: z.string(),
  type: z.enum(["title", "content", "section"]),
  title: z.string(),
  content: z.array(z.string()).optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string().url().optional(), // New: Support for slide images
  notes: z.string().optional(), // Optional: Speaker notes for the slide
});

export type Slide = z.infer<typeof slideSchema>;

// Presentation Schema with metadata
export const presentationSchema = z.object({
  id: z.string(),
  title: z.string(),
  slides: z.array(slideSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
  theme: z.string().optional(), // Optional: Theme name for consistent styling
  author: z.string().optional(), // Optional: Presentation author
  description: z.string().optional(), // Optional: Brief description
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

// Generate Slides Request
export const generateSlidesRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty").max(2000, "Prompt too long"),
  sessionId: z.string().optional(),
  includeImages: z.boolean().optional().default(true), // New: Toggle image generation
  slideCount: z.number().min(3).max(15).optional(), // New: Preferred slide count
  style: z.enum(["professional", "creative", "minimal", "academic"]).optional(), // New: Presentation style
});

export type GenerateSlidesRequest = z.infer<typeof generateSlidesRequestSchema>;

// Generate Slides Response
export const generateSlidesResponseSchema = z.object({
  presentation: presentationSchema,
  message: messageSchema,
  sessionId: z.string(),
});

export type GenerateSlidesResponse = z.infer<typeof generateSlidesResponseSchema>;

// Update Slides Request
export const updateSlidesRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty").max(2000, "Prompt too long"),
  sessionId: z.string(),
  slideIndex: z.number().optional(), // Optional: Specific slide to edit
  operation: z.enum(["edit", "add", "remove", "reorder", "regenerate"]).optional(), // New: Type of operation
});

export type UpdateSlidesRequest = z.infer<typeof updateSlidesRequestSchema>;

// Update Slides Response
export const updateSlidesResponseSchema = z.object({
  presentation: presentationSchema,
  message: messageSchema,
  modifiedSlides: z.array(z.number()).optional(), // New: Indices of modified slides
});

export type UpdateSlidesResponse = z.infer<typeof updateSlidesResponseSchema>;

// New: Regenerate Single Slide Request
export const regenerateSlideRequestSchema = z.object({
  sessionId: z.string(),
  slideIndex: z.number().min(0),
  focusArea: z.enum(["content", "title", "all"]).optional(), // What to regenerate
});

export type RegenerateSlideRequest = z.infer<typeof regenerateSlideRequestSchema>;

// New: Export Presentation Request
export const exportPresentationRequestSchema = z.object({
  sessionId: z.string(),
  format: z.enum(["pptx", "pdf", "json"]),
  includeNotes: z.boolean().optional().default(false),
  theme: z.string().optional(), // Override theme for export
});

export type ExportPresentationRequest = z.infer<typeof exportPresentationRequestSchema>;

// New: Slide Template for AI generation
export const slideTemplateSchema = z.object({
  type: z.enum(["title", "content", "section"]),
  title: z.string(),
  subtitle: z.string().optional(),
  content: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
  notes: z.string().optional(),
  layout: z.enum([
    "centered",
    "leftAligned", 
    "splitScreen",
    "minimalist",
    "classic",
    "twoColumn",
    "featured",
    "timeline",
    "bold",
    "diagonal",
    "gradient",
    "minimal"
  ]).optional(), // Layout variant
});

export type SlideTemplate = z.infer<typeof slideTemplateSchema>;

// Validation helpers
export const validateSlide = (slide: unknown): Slide => {
  return slideSchema.parse(slide);
};

export const validatePresentation = (presentation: unknown): Presentation => {
  return presentationSchema.parse(presentation);
};

export const validateMessage = (message: unknown): Message => {
  return messageSchema.parse(message);
};

// Helper function to create a new slide with defaults
export const createSlide = (
  type: Slide["type"],
  title: string,
  options?: {
    content?: string[];
    subtitle?: string;
    imageUrl?: string;
    notes?: string;
  }
): Slide => {
  return {
    id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    ...options,
  };
};

// Helper function to create a new presentation
export const createPresentation = (
  title: string,
  slides: Slide[],
  options?: {
    theme?: string;
    author?: string;
    description?: string;
  }
): Presentation => {
  const now = Date.now();
  return {
    id: `pres-${now}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    slides,
    createdAt: now,
    updatedAt: now,
    ...options,
  };
};

// Helper function to create a new message
export const createMessage = (
  role: Message["role"],
  content: string
): Message => {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    role,
    content,
    timestamp: Date.now(),
  };
};

// Type guards
export const isSlide = (obj: unknown): obj is Slide => {
  return slideSchema.safeParse(obj).success;
};

export const isPresentation = (obj: unknown): obj is Presentation => {
  return presentationSchema.safeParse(obj).success;
};

export const isMessage = (obj: unknown): obj is Message => {
  return messageSchema.safeParse(obj).success;
};

// Slide content validation helpers
export const validateBulletPoints = (content: string[]): boolean => {
  // Each bullet should be 5-12 words (as per improved prompt)
  return content.every(bullet => {
    const wordCount = bullet.trim().split(/\s+/).length;
    return wordCount >= 3 && wordCount <= 15;
  });
};

export const validateSlideCount = (slides: Slide[]): boolean => {
  // Should have 6-10 slides as per improved prompt
  return slides.length >= 3 && slides.length <= 15;
};

export const validatePresentationStructure = (slides: Slide[]): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // Should start with a title slide
  if (slides.length > 0 && slides[0].type !== 'title') {
    errors.push('Presentation should start with a title slide');
  }
  
  // Should have at least one content slide
  const hasContent = slides.some(s => s.type === 'content');
  if (!hasContent) {
    errors.push('Presentation should have at least one content slide');
  }
  
  // Validate slide count
  if (!validateSlideCount(slides)) {
    errors.push('Presentation should have between 3-15 slides');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};