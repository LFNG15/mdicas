import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, ok, serverError, logError } from "@/lib/security/http";
import { isUuid } from "@/lib/security/validators";
import { ShoppingListsRepo } from "@/lib/repositories/shopping-lists.repo";

type Ctx = { params: { id: string } };

export const DELETE = withAdminAuth<Ctx>(async (_req, { params }) => {
  if (!isUuid(params.id)) return badRequest("ID inválido");

  const { error } = await ShoppingListsRepo.remove(params.id);
  if (error) {
    logError("shopping-lists:delete", error);
    return serverError("Falha ao remover lista");
  }
  return ok({ ok: true });
});
