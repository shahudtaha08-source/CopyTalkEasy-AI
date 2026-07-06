import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { db } from "./db";
import { moods, conversations, messages, users } from "@shared/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { openai } from "./replit_integrations/audio/client";

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

  app.get(api.moods.list.path, isAuthenticated, async (req: any, res) => {
    res.json(await storage.getMoods(req.user.claims.sub));
  });

  app.post(api.moods.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.moods.create.input.parse(req.body);
      res.status(201).json(await storage.createMood(req.user.claims.sub, input));
    } catch {
      res.status(400).json({ message: "Failed to create mood" });
    }
  });

  app.get(api.habits.list.path, isAuthenticated, async (req: any, res) => {
    res.json(await storage.getHabits(req.user.claims.sub, req.query.date as string | undefined));
  });

  app.post(api.habits.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.habits.create.input.parse(req.body);
      res.status(201).json(await storage.createHabit(req.user.claims.sub, input));
    } catch {
      res.status(400).json({ message: "Failed to create habit" });
    }
  });

  app.patch("/api/habits/:id", isAuthenticated, async (req: any, res) => {
    try {
      const input = api.habits.update.input.parse(req.body);
      res.json(await storage.updateHabit(parseInt(req.params.id), input));
    } catch {
      res.status(400).json({ message: "Failed to update habit" });
    }
  });

  app.get(api.chat.list.path, isAuthenticated, async (req: any, res) => {
    const result = await db.select().from(conversations).where(eq(conversations.userId, req.user.claims.sub)).orderBy(desc(conversations.createdAt));
    res.json(result);
  });

  app.post(api.chat.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.chat.create.input.parse(req.body);
      const [conversation] = await db.insert(conversations).values({ ...input, userId: req.user.claims.sub }).returning();
      res.status(201).json(conversation);
    } catch {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.get(api.chat.history.path, isAuthenticated, async (req: any, res) => {
    const id = parseInt(req.params.id);
    res.json(await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt));
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
Return valid JSON only in this format:
{"content":"supportive response","detectedEmotion":"stress|sadness|anxiety|loneliness|anger|happiness|neutral","aiSuggestion":"short practical step or null"}`;

      await db.insert(messages).values({ conversationId: id, role: "user", content });
      const history = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
      const messagesForAI = [
        { role: "system", content: systemPrompt },
        ...history.map((message) => ({ role: message.role as "user" | "assistant", content: message.content })),
      ];

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: messagesForAI as any,
        response_format: { type: "json_object" },
        stream: false,
      });

      const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
      await db.insert(messages).values({
        conversationId: id,
        role: "assistant",
        content: parsed.content || "",
        detectedEmotion: parsed.detectedEmotion,
        aiSuggestion: parsed.aiSuggestion,
      });

      res.write(`data: ${JSON.stringify({ content: parsed.content || "", detectedEmotion: parsed.detectedEmotion, aiSuggestion: parsed.aiSuggestion })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error(error);
      if (!res.headersSent) res.status(500).json({ error: "Failed to process message" });
      else {
        res.write(`data: ${JSON.stringify({ error: "Failed to process message" })}\n\n`);
        res.end();
      }
    }
  });

  app.get(api.history.emotional.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const userMoods = await db.select().from(moods).where(eq(moods.userId, userId)).orderBy(desc(moods.date));
    const userConvos = await db.select({ id: conversations.id }).from(conversations).where(eq(conversations.userId, userId));
    const convoIds = userConvos.map((conversation) => conversation.id);
    let userMessages: any[] = [];

    if (convoIds.length > 0) {
      userMessages = await db.select().from(messages).where(and(inArray(messages.conversationId, convoIds), eq(messages.role, "assistant"))).orderBy(desc(messages.createdAt));
    }

    const history = [
      ...userMoods.map((mood) => ({ id: mood.id, date: typeof mood.date === "string" ? mood.date : mood.date.toISOString(), type: "mood", value: mood.mood, notes: mood.notes })),
      ...userMessages.filter((message) => message.detectedEmotion).map((message) => ({ id: message.id, date: message.createdAt.toISOString(), type: "emotion", value: message.detectedEmotion, suggestion: message.aiSuggestion })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json(history);
  });

  return httpServer;
}
