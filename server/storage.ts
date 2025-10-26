import { type ChatSession, type Message, type Presentation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Chat sessions
  getSession(id: string): Promise<ChatSession | undefined>;
  createSession(session: Omit<ChatSession, 'id'>): Promise<ChatSession>;
  updateSession(id: string, session: Partial<ChatSession>): Promise<ChatSession>;
  
  // Messages
  addMessage(sessionId: string, message: Message): Promise<void>;
  
  // Presentations
  updatePresentation(sessionId: string, presentation: Presentation): Promise<void>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, ChatSession>;

  constructor() {
    this.sessions = new Map();
  }

  async getSession(id: string): Promise<ChatSession | undefined> {
    return this.sessions.get(id);
  }

  async createSession(session: Omit<ChatSession, 'id'>): Promise<ChatSession> {
    const id = randomUUID();
    const newSession: ChatSession = { ...session, id };
    this.sessions.set(id, newSession);
    return newSession;
  }

  async updateSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    const session = this.sessions.get(id);
    if (!session) {
      throw new Error("Session not found");
    }
    const updatedSession = { ...session, ...updates, updatedAt: Date.now() };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async addMessage(sessionId: string, message: Message): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    session.messages.push(message);
    session.updatedAt = Date.now();
    this.sessions.set(sessionId, session);
  }

  async updatePresentation(sessionId: string, presentation: Presentation): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    session.presentation = presentation;
    session.updatedAt = Date.now();
    this.sessions.set(sessionId, session);
  }
}

export const storage = new MemStorage();
