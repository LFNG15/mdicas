import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, ok, serverError, logError } from "@/lib/security/http";
import { isUuid } from "@/lib/security/validators";
import { ShoppingListsRepo } from "@/lib/repositories/shopping-lists.repo";

type Ctx = { params: { id: string; itemId: string } };

export const DELETE = withAdminAuth<Ctx>(async (_req, { params }) => {
  if (!isUuid(params.id) || !isUuid(params.itemId)) return badRequest("ID inválido");

  const { error } = await ShoppingListsRepo.removeItem(params.id, params.itemId);
  if (error) {
    logError("shopping-list-items:delete", error);
    return serverError("Falha ao remover item");
  }
  return ok({ ok: true });
});
