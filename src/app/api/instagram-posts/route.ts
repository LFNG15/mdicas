import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, ok, serverError, logError } from "@/lib/security/http";
import { parseInstagramInput } from "@/lib/dto/instagram.dto";
import { InstagramRepo } from "@/lib/repositories/instagram.repo";

export async function GET() {
  const { data, error } = await InstagramRepo.list();
  if (error) {
    logError("instagram:list", error);
    return serverError("Falha ao carregar posts");
  }
  return NextResponse.json(data);
}

export const POST = withAdminAuth(async (request: Request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("JSON inválido");
  }

  const parsed = parseInstagramInput(body);
  if (!parsed.ok) return badRequest(parsed.error);

  const { data, error } = await InstagramRepo.create(parsed.value);
  if (error) {
    logError("instagram:create", error);
    return serverError("Falha ao criar post");
  }
  return ok(data);
});
