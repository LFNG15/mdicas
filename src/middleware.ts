import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

const BASIC_AUTH_REALM = "Acesso restrito - site em testes";
const COOKIE_NAME = "bauth";
const COOKIE_TTL_SECONDS = 60 * 60 * 8; // 8 horas

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bufToHex(sig);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyAuthCookie(cookie: string | undefined, secret: string): Promise<boolean> {
  if (!cookie) return false;
  const parts = cookie.split(".");
  if (parts.length !== 3) return false;
  const [email, expStr, sig] = parts;
  const exp = parseInt(expStr, 10);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = await hmac(`${email}.${expStr}`, secret);
  return constantTimeEqual(sig, expected);
}

function unauthorized(): NextResponse {
  return new NextResponse("Autenticação necessária", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${BASIC_AUTH_REALM}", charset="UTF-8"`,
    },
  });
}

function decodeBasicAuth(header: string | null): { email: string; password: string } | null {
  if (!header || !header.toLowerCase().startsWith("basic ")) return null;
  try {
    const decoded = atob(header.slice(6).trim());
    const idx = decoded.indexOf(":");
    if (idx < 0) return null;
    return { email: decoded.slice(0, idx), password: decoded.slice(idx + 1) };
  } catch {
    return null;
  }
}

async function validateAgainstSupabase(email: string, password: string): Promise<boolean> {
  const sb = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error || !data.user) return false;
  await sb.auth.signOut().catch(() => {});
  return true;
}

async function refreshSupabaseSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return supabaseResponse;
}

export async function middleware(request: NextRequest) {
  const secret = process.env.BASIC_AUTH_SECRET;

  if (!secret) {
    return refreshSupabaseSession(request);
  }

  const existingCookie = request.cookies.get(COOKIE_NAME)?.value;
  if (await verifyAuthCookie(existingCookie, secret)) {
    return refreshSupabaseSession(request);
  }

  const creds = decodeBasicAuth(request.headers.get("authorization"));
  if (!creds) return unauthorized();

  const isValid = await validateAgainstSupabase(creds.email, creds.password);
  if (!isValid) return unauthorized();

  const exp = Date.now() + COOKIE_TTL_SECONDS * 1000;
  const sig = await hmac(`${creds.email}.${exp}`, secret);
  const cookieValue = `${creds.email}.${exp}.${sig}`;

  const response = await refreshSupabaseSession(request);
  response.cookies.set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_TTL_SECONDS,
    path: "/",
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|logo-dark.jpg|logo-light.jpg).*)",
  ],
};
