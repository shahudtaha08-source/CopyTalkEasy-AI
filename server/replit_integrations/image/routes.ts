import type { Express, Request, Response } from "express";

export function registerImageRoutes(app: Express): void {
  app.post("/api/generate-image", async (_req: Request, res: Response) => {
    res.status(503).json({ error: "AI image generation is disabled in this release." });
  });
}

