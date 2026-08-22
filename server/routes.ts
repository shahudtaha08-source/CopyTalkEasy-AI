import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { db } from "./db";
import { moods, habits, conversations, messages, users } from "@shared/schema";
import { desc, eq, inArray, and } from "drizzle-orm";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.patch(api.user.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.user.update.input.parse(req.body);
      const user = await storage.updateUser(req.user.claims.sub, input);
      res.json(user);
    } catch {
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  app.get(api.moods.list.path, isAuthenticated, async (req: any, res) => res.json(await storage.getMoods(req.user.claims.sub)));
  app.post(api.moods.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.moods.create.input.parse(req.body);
      res.status(201).json(await storage.createMood(req.user.claims.sub, input));
    } catch { res.status(400).json({ message: "Failed to create mood" }); }
  });

  app.get(api.habits.list.path, isAuthenticated, async (req: any, res) => {
    res.json(await storage.getHabits(req.user.claims.sub, req.query.date as string | undefined));
  });
  app.post(api.habits.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.habits.create.input.parse(req.body);
      res.status(201).json(await storage.createHabit(req.user.claims.sub, input));
    } catch { res.status(400).json({ message: "Failed to create habit" }); }
  });
  app.patch("/api/habits/:id", isAuthenticated, async (req: any, res) => {
    try {
      const input = api.habits.update.input.parse(req.body);
      res.json(await storage.updateHabit(parseInt(req.params.id), input));
    } catch { res.status(400).json({ message: "Failed to update habit" }); }
  });

  app.get(api.chat.list.path, isAuthenticated, async (req: any, res) => {
    res.json(await db.select().from(conversations).where(eq(conversations.userId, req.user.claims.sub)).orderBy(desc(conversations.createdAt)));
  });
  app.post(api.chat.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.chat.create.input.parse(req.body);
      const [conversation] = await db.insert(conversations).values({ ...input, userId: req.user.claims.sub }).returning();
      res.status(201).json(conversation);
    } catch { res.status(400).json({ message: "Invalid input" }); }
  });
  app.get(api.chat.history.path, isAuthenticated, async (req: any, res) => {
    res.json(await db.select().from(messages).where(eq(messages.conversationId, parseInt(req.params.id))).orderBy(messages.createdAt));
  });

  // Support Chat is intentionally disabled until the Ollama-based implementation is ready.
  // No OpenAI SDK or OpenAI API dependency is used by CopyTalkEasy.
  app.post(api.chat.sendMessage.path, isAuthenticated, async (_req: any, res) => {
    res.status(503).json({
      error: "Support Chat is currently IN DEVELOPMENT",
      code: "SUPPORT_CHAT_IN_DEVELOPMENT",
    });
  });

  app.get(api.history.emotional.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const userMoods = await db.select().from(moods).where(eq(moods.userId, userId)).orderBy(desc(moods.date));
    const userConvos = await db.select({ id: conversations.id }).from(conversations).where(eq(conversations.userId, userId));
    const convoIds = userConvos.map(c => c.id);
    let userMessages: any[] = [];
    if (convoIds.length > 0) {
      userMessages = await db.select().from(messages)
        .where(and(inArray(messages.conversationId, convoIds), eq(messages.role, "assistant")))
        .orderBy(desc(messages.createdAt));
    }
    const history = [
      ...userMoods.map(m => ({ id: m.id, date: typeof m.date === "string" ? m.date : m.date.toISOString(), type: "mood", value: m.mood, notes: m.notes })),
      ...userMessages.filter(m => m.detectedEmotion).map(m => ({ id: m.id, date: m.createdAt.toISOString(), type: "emotion", value: m.detectedEmotion, suggestion: m.aiSuggestion }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(history);
  });

  return httpServer;
}
