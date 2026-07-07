import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";

const DEMO_USER_ID = "talkeasy-demo-user";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({ conString: process.env.DATABASE_URL, createTableIfMissing: true, ttl: sessionTtl, tableName: "sessions" });
  return session({ secret: process.env.SESSION_SECRET || "talkeasy-local-development-secret", store: sessionStore, resave: false, saveUninitialized: false, cookie: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: sessionTtl } });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  await authStorage.upsertUser({ id: DEMO_USER_ID, email: "user@talkeasy.local", firstName: "TalkEasy", lastName: "User", profileImageUrl: null });
  app.use((req: any, _res, next) => {
    if (req.session?.demoLoggedOut !== true) req.user = { claims: { sub: DEMO_USER_ID }, expires_at: Number.MAX_SAFE_INTEGER };
    next();
  });
  app.get("/api/login", (req: any, res) => { req.session.demoLoggedOut = false; req.user = { claims: { sub: DEMO_USER_ID }, expires_at: Number.MAX_SAFE_INTEGER }; res.redirect("/dashboard"); });
  app.get("/api/callback", (_req, res) => res.redirect("/dashboard"));
  app.get("/api/logout", (req: any, res) => { req.session.demoLoggedOut = true; req.user = undefined; req.session.save(() => res.redirect("/")); });
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  if (req.session?.demoLoggedOut === true || !req.user) return res.status(401).json({ message: "Unauthorized" });
  next();
};
