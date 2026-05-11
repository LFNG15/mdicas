import { revalidatePath } from "next/cache";
import type { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, conflict, ok, serverError, logError } from "@/lib/security/http";
import { isUuid } from "@/lib/security/validators";
import { parsePostInput } from "@/lib/dto/post.dto";
import { PostsRepo } from "@/lib/repositories/posts.repo";

type Ctx = { params: { id: string } };

const UNIQUE_VIOLATION = "23505";

function revalidatePostPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/artigos");
  revalidatePath(`/artigo/${slug}`);
}

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
    if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
      return conflict("Já existe um artigo com este slug");
    }
    logError("posts:update", error);
    return serverError("Falha ao atualizar post");
  }

  revalidatePostPaths(parsed.value.slug);
  return ok({ ok: true });
});

export const DELETE = withAdminAuth<Ctx>(async (_request, { params }): Promise<NextResponse> => {
  if (!isUuid(params.id)) return badRequest("ID inválido");

  const { error } = await PostsRepo.remove(params.id);
  if (error) {
    logError("posts:delete", error);
    return serverError("Falha ao remover post");
  }

  revalidatePath("/");
  revalidatePath("/artigos");
  return ok({ ok: true });
});
