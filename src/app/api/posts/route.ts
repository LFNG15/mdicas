import { revalidatePath } from "next/cache";
import type { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, conflict, ok, serverError, logError } from "@/lib/security/http";
import { parsePostInput } from "@/lib/dto/post.dto";
import { PostsRepo } from "@/lib/repositories/posts.repo";
import { rowToPost, type PostRow } from "@/lib/supabase/types";

const UNIQUE_VIOLATION = "23505";

export const GET = withAdminAuth(async (): Promise<NextResponse> => {
  const { data, error } = await PostsRepo.list();
  if (error) {
    logError("posts:list", error);
    return serverError("Falha ao listar posts");
  }
  return ok((data as PostRow[]).map(rowToPost));
});

export const POST = withAdminAuth(async (request: Request): Promise<NextResponse> => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("JSON inválido");
  }

  const parsed = parsePostInput(body);
  if (!parsed.ok) return badRequest(parsed.error);

  const { error } = await PostsRepo.create(parsed.value);
  if (error) {
    if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
      return conflict("Já existe um artigo com este slug");
    }
    logError("posts:create", error);
    return serverError("Falha ao criar post");
  }

  revalidatePath("/");
  revalidatePath("/artigos");
  revalidatePath(`/artigo/${parsed.value.slug}`);

  return ok({ ok: true });
});
