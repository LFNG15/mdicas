import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, ok, serverError, logError } from "@/lib/security/http";
import { isUuid } from "@/lib/security/validators";
import { parseShoppingListItemInput } from "@/lib/dto/shopping-list.dto";
import { ShoppingListsRepo } from "@/lib/repositories/shopping-lists.repo";

type Ctx = { params: { id: string } };

export const POST = withAdminAuth<Ctx>(async (request, { params }) => {
  if (!isUuid(params.id)) return badRequest("ID inválido");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("JSON inválido");
  }

  const parsed = parseShoppingListItemInput(body);
  if (!parsed.ok) return badRequest(parsed.error);

  const { count, error: countError } = await ShoppingListsRepo.countItems(params.id);
  if (countError) {
    logError("shopping-list-items:count", countError);
    return serverError("Falha ao adicionar item");
  }

  const { data, error } = await ShoppingListsRepo.addItem(params.id, parsed.value, count ?? 0);
  if (error) {
    logError("shopping-list-items:create", error);
    return serverError("Falha ao adicionar item");
  }
  return ok(data);
});
