import { isSafeUrl } from "@/lib/security/sanitize";
import { asOptionalTrimmedString } from "@/lib/security/validators";

export interface InstagramPostInput {
  url: string;
  image_url: string;
  caption: string;
}

export type InstagramParseResult =
  | { ok: true; value: InstagramPostInput }
  | { ok: false; error: string };

export function parseInstagramInput(raw: unknown): InstagramParseResult {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Payload inválido" };
  const r = raw as Record<string, unknown>;

  if (!isSafeUrl(r.url)) return { ok: false, error: "URL inválida" };
  if (!isSafeUrl(r.image_url)) return { ok: false, error: "URL da imagem inválida" };

  return {
    ok: true,
    value: {
      url: r.url,
      image_url: r.image_url,
      caption: asOptionalTrimmedString(r.caption, 2000),
    },
  };
}
