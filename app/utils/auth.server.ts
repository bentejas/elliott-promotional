import { createCookieSessionStorage } from "react-router";

// Environment variables for admin authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [
  "admin@elliottpromotional.com",
  "manager@elliottpromotional.com",
  "owner@elliottpromotional.com",
];

// Session storage configuration
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__admin_session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "admin-secret-key"],
    secure: process.env.NODE_ENV === "production",
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

export function validateAdminCredentials(
  email: string,
  password: string
): boolean {
  return ADMIN_EMAILS.includes(email) && password === ADMIN_PASSWORD;
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
