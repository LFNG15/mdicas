import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, ok, serverError, logError } from "@/lib/security/http";
import { parseGrupoOfertaInput } from "@/lib/dto/grupos-ofertas.dto";
import { GruposOfertasRepo } from "@/lib/repositories/grupos-ofertas.repo";

export async function GET() {
  const { data, error } = await GruposOfertasRepo.listActive();
  if (error) {
    logError("grupos-ofertas:list", error);
    return serverError("Falha ao carregar grupos");
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

  const parsed = parseGrupoOfertaInput(body);
  if (!parsed.ok) return badRequest(parsed.error);

  const { data, error } = await GruposOfertasRepo.create(parsed.value);
  if (error) {
    logError("grupos-ofertas:create", error);
    return serverError("Falha ao criar grupo");
  }
  return ok(data);
});
