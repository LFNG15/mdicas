import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, ok, serverError, logError } from "@/lib/security/http";
import { isUuid } from "@/lib/security/validators";
import { GruposOfertasRepo } from "@/lib/repositories/grupos-ofertas.repo";

type Ctx = { params: { id: string } };

export const DELETE = withAdminAuth<Ctx>(async (_req, { params }) => {
  if (!isUuid(params.id)) return badRequest("ID inválido");

  const { error } = await GruposOfertasRepo.remove(params.id);
  if (error) {
    logError("grupos-ofertas:delete", error);
    return serverError("Falha ao remover grupo");
  }
  return ok({ ok: true });
});
