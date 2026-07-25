import { createCookieSessionStorage } from "react-router";
import { timingSafeEqual } from "node:crypto";

const isProduction = process.env.NODE_ENV === "production";

// Credentials must come from the environment. In production we refuse to
// boot without them; in development we fall back with a loud warning so
// local setup stays easy.
function requiredSecret(name: string, devFallback: string): string {
  const value = process.env[name];
  if (value) return value;
  if (isProduction) {
    throw new Error(`${name} must be set in production`);
  }
  console.warn(`[auth] ${name} is not set — using an insecure development fallback`);
  return devFallback;
}

const ADMIN_PASSWORD = requiredSecret("ADMIN_PASSWORD", "dev-only-password");
const SESSION_SECRET = requiredSecret("SESSION_SECRET", "dev-only-session-secret");

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [
  "admin@elliottpromotional.ca",
  "manager@elliottpromotional.ca",
  "owner@elliottpromotional.ca",
];

// Session storage configuration
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__admin_session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: isProduction,
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function commitSession(session: any) {
  return sessionStorage.commitSession(session);
}

export async function destroySession(session: any) {
  return sessionStorage.destroySession(session);
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function validateAdminCredentials(
  email: string,
  password: string
): boolean {
  return ADMIN_EMAILS.includes(email) && safeCompare(password, ADMIN_PASSWORD);
}

export function getWhitelistedEmails(): string[] {
  return ADMIN_EMAILS;
}

export async function requireAdminAuth(request: Request) {
  const session = await getSession(request);
  const isAuthenticated = session.get("isAuthenticated");

  if (!isAuthenticated) {
    throw new Response(null, {
      status: 302,
      headers: {
        Location: "/admin/login",
      },
    });
  }

  return session;
}

export async function createAdminSession(email: string) {
  const session = await sessionStorage.getSession();
  session.set("isAuthenticated", true);
  session.set("adminEmail", email);
  return session;
}
