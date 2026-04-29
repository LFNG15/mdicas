import { isSafeUrl } from "@/lib/security/sanitize";
import { asTrimmedString } from "@/lib/security/validators";

const ALLOWED_PLATFORMS = new Set(["whatsapp", "telegram"]);

export interface GrupoOfertaInput {
  platform: string;
  name: string;
  url: string;
}

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function parseGrupoOfertaInput(raw: unknown): ParseResult<GrupoOfertaInput> {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Payload inválido" };
  const r = raw as Record<string, unknown>;

  const platform = typeof r.platform === "string" ? r.platform.trim().toLowerCase() : "";
  if (!ALLOWED_PLATFORMS.has(platform)) return { ok: false, error: "Plataforma inválida" };

  const name = asTrimmedString(r.name, 120);
  if (!name) return { ok: false, error: "Nome obrigatório" };

  if (!isSafeUrl(r.url)) return { ok: false, error: "URL inválida" };

  return { ok: true, value: { platform, name, url: r.url } };
}
