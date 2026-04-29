import { isSafeUrl } from "@/lib/security/sanitize";
import { asTrimmedString, asOptionalTrimmedString } from "@/lib/security/validators";

export interface ShoppingListInput {
  name: string;
}

export interface ShoppingListItemInput {
  name: string;
  affiliate_url: string;
  image_url: string;
  price: string;
}

export type ListParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function parseShoppingListInput(raw: unknown): ListParseResult<ShoppingListInput> {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Payload inválido" };
  const name = asTrimmedString((raw as Record<string, unknown>).name, 200);
  if (!name) return { ok: false, error: "Nome obrigatório" };
  return { ok: true, value: { name } };
}

export function parseShoppingListItemInput(raw: unknown): ListParseResult<ShoppingListItemInput> {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Payload inválido" };
  const r = raw as Record<string, unknown>;

  const name = asTrimmedString(r.name, 200);
  if (!name) return { ok: false, error: "Nome obrigatório" };

  if (!isSafeUrl(r.affiliate_url)) return { ok: false, error: "Link inválido" };

  const image_url = r.image_url == null || r.image_url === "" ? "" : (isSafeUrl(r.image_url) ? r.image_url : null);
  if (image_url === null) return { ok: false, error: "URL da imagem inválida" };

  return {
    ok: true,
    value: {
      name,
      affiliate_url: r.affiliate_url,
      image_url,
      price: asOptionalTrimmedString(r.price, 50),
    },
  };
}
