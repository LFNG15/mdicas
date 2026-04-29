import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, ok, serverError, logError } from "@/lib/security/http";
import { parseShoppingListInput } from "@/lib/dto/shopping-list.dto";
import { ShoppingListsRepo } from "@/lib/repositories/shopping-lists.repo";

export async function GET() {
  const { data, error } = await ShoppingListsRepo.list();
  if (error) {
    logError("shopping-lists:list", error);
    return serverError("Falha ao carregar listas");
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

  const parsed = parseShoppingListInput(body);
  if (!parsed.ok) return badRequest(parsed.error);

  const { data, error } = await ShoppingListsRepo.create(parsed.value);
  if (error) {
    logError("shopping-lists:create", error);
    return serverError("Falha ao criar lista");
  }
  return ok(data);
});
