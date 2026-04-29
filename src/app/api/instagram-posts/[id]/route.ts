import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, ok, serverError, logError } from "@/lib/security/http";
import { isUuid } from "@/lib/security/validators";
import { InstagramRepo } from "@/lib/repositories/instagram.repo";

type Ctx = { params: { id: string } };

export const DELETE = withAdminAuth<Ctx>(async (_request, { params }) => {
  if (!isUuid(params.id)) return badRequest("ID inválido");

  const { error } = await InstagramRepo.remove(params.id);
  if (error) {
    logError("instagram:delete", error);
    return serverError("Falha ao remover post");
  }
  return ok({ ok: true });
});
