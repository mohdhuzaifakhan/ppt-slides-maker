import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generatePresentationFromPrompt, updatePresentationSlides } from "./gemini";
import { 
  generateSlidesRequestSchema, 
  updateSlidesRequestSchema,
  type Message,
  type Presentation 
} from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate slides from prompt
  app.post("/api/generate-slides", async (req, res) => {
    try {
      const validatedData = generateSlidesRequestSchema.parse(req.body);
      const { prompt, sessionId } = validatedData;

      let session;
      
      // Get or create session
      if (sessionId) {
        session = await storage.getSession(sessionId);
        if (!session) {
          return res.status(404).json({ error: "Session not found" });
        }
      }

      // Generate presentation using Gemini AI
      const aiResponse = await generatePresentationFromPrompt(prompt);
      
      // Create presentation object
      const presentation: Presentation = {
        id: randomUUID(),
        title: aiResponse.title,
        slides: aiResponse.slides,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Create AI response message
      const aiMessage: Message = {
        id: randomUUID(),
        role: "assistant",
        content: `I've created a presentation titled "${aiResponse.title}" with ${aiResponse.slides.length} slides. You can preview it on the right and download it when ready.`,
        timestamp: Date.now(),
      };

      // Update or create session
      if (session) {
        await storage.addMessage(session.id, aiMessage);
        await storage.updatePresentation(session.id, presentation);
      } else {
        session = await storage.createSession({
          messages: [aiMessage],
          presentation,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      res.json({
        presentation,
        message: aiMessage,
        sessionId: session.id,
      });
    } catch (error) {
      console.error("Generate slides error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to generate slides" 
      });
    }
  });

  // Update existing presentation slides
  app.post("/api/update-slides", async (req, res) => {
    try {
      const validatedData = updateSlidesRequestSchema.parse(req.body);
      const { prompt, sessionId, slideIndex } = validatedData;

      const session = await storage.getSession(sessionId);
      if (!session || !session.presentation) {
        return res.status(404).json({ error: "Session or presentation not found" });
      }

      // Update slides using Gemini AI
      const updatedSlides = await updatePresentationSlides(
        prompt,
        session.presentation.slides,
        slideIndex
      );

      // Update presentation
      const updatedPresentation: Presentation = {
        ...session.presentation,
        slides: updatedSlides,
        updatedAt: Date.now(),
      };

      // Create AI response message
      const aiMessage: Message = {
        id: randomUUID(),
        role: "assistant",
        content: `I've updated the presentation based on your request. The changes have been applied to your slides.`,
        timestamp: Date.now(),
      };

      await storage.addMessage(sessionId, aiMessage);
      await storage.updatePresentation(sessionId, updatedPresentation);

      res.json({
        presentation: updatedPresentation,
        message: aiMessage,
      });
    } catch (error) {
      console.error("Update slides error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to update slides" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
