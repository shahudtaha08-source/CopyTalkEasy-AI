import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { storage } from "./storage";
import { setupLocalAuth, isAuthenticated } from "./auth";
import { api } from "@shared/routes";
import { db } from "./db";
import { moods, conversations, messages, users, journals } from "@shared/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const baseURL = process.env.OPENAI_BASE_URL || process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  return new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  setupLocalAuth(app);

  app.patch(api.user.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.user.update.input.parse(req.body);
      res.json(await storage.updateUser(req.user.claims.sub, input));
    } catch { res.status(400).json({ message: "Failed to update user" }); }
  });

  app.get(api.moods.list.path, isAuthenticated, async (req: any, res) => res.json(await storage.getMoods(req.user.claims.sub)));
  app.post(api.moods.create.path, isAuthenticated, async (req: any, res) => {
    try { const input = api.moods.create.input.parse(req.body); res.status(201).json(await storage.createMood(req.user.claims.sub, input)); }
    catch { res.status(400).json({ message: "Failed to create mood" }); }
  });

  app.get(api.habits.list.path, isAuthenticated, async (req: any, res) => res.json(await storage.getHabits(req.user.claims.sub, req.query.date as string | undefined)));
  app.post(api.habits.create.path, isAuthenticated, async (req: any, res) => {
    try { const input = api.habits.create.input.parse(req.body); res.status(201).json(await storage.createHabit(req.user.claims.sub, input)); }
    catch { res.status(400).json({ message: "Failed to create habit" }); }
  });
  app.patch("/api/habits/:id", isAuthenticated, async (req: any, res) => {
    try { const input = api.habits.update.input.parse(req.body); res.json(await storage.updateHabit(parseInt(req.params.id), input)); }
    catch { res.status(400).json({ message: "Failed to update habit" }); }
  });

  app.get(api.journals.list.path, isAuthenticated, async (req: any, res) => res.json(await storage.getJournals(req.user.claims.sub)));
  app.post(api.journals.create.path, isAuthenticated, async (req: any, res) => {
    try { const input = api.journals.create.input.parse(req.body); res.status(201).json(await storage.createJournal(req.user.claims.sub, input)); }
    catch { res.status(400).json({ message: "Failed to create journal" }); }
  });
  app.patch("/api/journals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const [journal] = await db.update(journals).set(updates).where(eq(journals.id, id)).returning();
      res.json(journal);
    } catch { res.status(400).json({ message: "Failed to update journal" }); }
  });
  app.delete("/api/journals/:id", isAuthenticated, async (req: any, res) => {
    try {
      await db.delete(journals).where(eq(journals.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch { res.status(400).json({ message: "Failed to delete journal" }); }
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

  app.post(api.chat.sendMessage.path, isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { content } = req.body;
      const userId = req.user.claims.sub;
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      const systemPrompt = `You are TalkEasy, an AI mental wellness support companion, not a therapist, doctor, or emergency service.
The user is in the ${user?.ageGroup || "General"} age group and prefers ${user?.preferredLanguage || "English"}.
Respond warmly and clearly. Detect the primary emotional tone and offer a small practical self-care step when appropriate.
Never diagnose a mental health condition, prescribe medication, or claim to replace a psychologist.
If the user expresses suicidal intent, a plan, immediate danger, or inability to stay safe, prioritize immediate safety: encourage contacting local emergency services, a crisis helpline, and a trusted person who can stay with them. Do not present ordinary self-help as sufficient for imminent danger.
Return valid JSON only: {"content":"supportive response","detectedEmotion":"stress|sadness|anxiety|loneliness|anger|happiness|neutral","aiSuggestion":"short practical step or null"}`;

      await db.insert(messages).values({ conversationId: id, role: "user", content });
      const history = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const completion = await getOpenAI().chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...history.map((message) => ({ role: message.role as "user" | "assistant", content: message.content }))] as any,
        response_format: { type: "json_object" },
        stream: false,
      });
      const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
      await db.insert(messages).values({ conversationId: id, role: "assistant", content: parsed.content || "", detectedEmotion: parsed.detectedEmotion, aiSuggestion: parsed.aiSuggestion });
      res.write(`data: ${JSON.stringify({ content: parsed.content || "", detectedEmotion: parsed.detectedEmotion, aiSuggestion: parsed.aiSuggestion })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error(error);
      const fallbackContent = "I'm having a little trouble connecting right now, but I want you to know I'm here for you. Please take a deep breath. If you need immediate help, consider checking the Find Help page.";
      const fallbackResponse = { content: fallbackContent, detectedEmotion: "neutral", aiSuggestion: "Take a deep breath and rest." };
      
      try {
        await db.insert(messages).values({ conversationId: id, role: "assistant", content: fallbackContent, detectedEmotion: "neutral", aiSuggestion: "Take a deep breath and rest." });
      } catch (dbError) {
        console.error("DB error in fallback:", dbError);
      }

      if (!res.headersSent) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
      }
      res.write(`data: ${JSON.stringify(fallbackResponse)}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  });

  app.get(api.history.emotional.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const userMoods = await db.select().from(moods).where(eq(moods.userId, userId)).orderBy(desc(moods.date));
    const userJournals = await db.select().from(journals).where(eq(journals.userId, userId)).orderBy(desc(journals.date));
    const userConvos = await db.select({ id: conversations.id }).from(conversations).where(eq(conversations.userId, userId));
    const convoIds = userConvos.map((conversation) => conversation.id);
    let userMessages: any[] = [];
    if (convoIds.length > 0) userMessages = await db.select().from(messages).where(and(inArray(messages.conversationId, convoIds), eq(messages.role, "assistant"))).orderBy(desc(messages.createdAt));
    const history = [
      ...userMoods.map((mood) => ({ id: mood.id, date: typeof mood.date === "string" ? mood.date : mood.date.toISOString(), type: "mood", value: mood.mood, notes: mood.notes })),
      ...userJournals.map((journal) => ({ id: journal.id, date: typeof journal.date === "string" ? journal.date : journal.date.toISOString(), type: "journal", value: journal.title || 'Journal Entry', notes: journal.content, tags: journal.tags })),
      ...userMessages.filter((message) => message.detectedEmotion).map((message) => ({ id: message.id, date: message.createdAt.toISOString(), type: "emotion", value: message.detectedEmotion, suggestion: message.aiSuggestion })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(history);
  });

  return httpServer;
}
