import type { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, ok, serverError, logError } from "@/lib/security/http";
import { parsePostInput } from "@/lib/dto/post.dto";
import { PostsRepo } from "@/lib/repositories/posts.repo";

export const POST = withAdminAuth(async (request: Request): Promise<NextResponse> => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("JSON inválido");
  }

  const parsed = parsePostInput(body);
  if (!parsed.ok) return badRequest(parsed.error);

  const { error } = await PostsRepo.upsert(parsed.value);
  if (error) {
    logError("posts:upsert", error);
    return serverError("Falha ao salvar post");
  }
  return ok({ ok: true });
});
