import type { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, ok, serverError, logError } from "@/lib/security/http";
import { isUuid } from "@/lib/security/validators";
import { parsePostInput } from "@/lib/dto/post.dto";
import { PostsRepo } from "@/lib/repositories/posts.repo";

type Ctx = { params: { id: string } };

export const PUT = withAdminAuth<Ctx>(async (request, { params }): Promise<NextResponse> => {
  if (!isUuid(params.id)) return badRequest("ID inválido");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("JSON inválido");
  }

  const parsed = parsePostInput(body);
  if (!parsed.ok) return badRequest(parsed.error);

  const { error } = await PostsRepo.update(params.id, parsed.value);
  if (error) {
    logError("posts:update", error);
    return serverError("Falha ao atualizar post");
  }
  return ok({ ok: true });
});

export const DELETE = withAdminAuth<Ctx>(async (_request, { params }): Promise<NextResponse> => {
  if (!isUuid(params.id)) return badRequest("ID inválido");

  const { error } = await PostsRepo.remove(params.id);
  if (error) {
    logError("posts:delete", error);
    return serverError("Falha ao remover post");
  }
  return ok({ ok: true });
});
