// Sanitização defensiva mínima sem dependências externas.
// Para conteúdo público (UGC) prefira DOMPurify; aqui o autor é admin,
// então a meta é bloquear vetores XSS clássicos antes de gravar/renderizar.

const DANGEROUS_TAGS = /<\/?(script|iframe|object|embed|link|meta|style|base|form|svg|math)\b[^>]*>/gi;
const EVENT_HANDLERS = /\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_PROTOCOL_ATTR = /\s(?:href|src|xlink:href|action|formaction|poster)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*'|\s*javascript:[^\s>]+)/gi;
const DATA_PROTOCOL_ATTR = /\s(?:href|src)\s*=\s*(?:"\s*data:[^"]*"|'\s*data:[^']*')/gi;

export function sanitizeHtml(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(DANGEROUS_TAGS, "")
    .replace(EVENT_HANDLERS, "")
    .replace(JS_PROTOCOL_ATTR, "")
    .replace(DATA_PROTOCOL_ATTR, "");
}

const SAFE_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

export function isSafeUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048) {
    return false;
  }
  try {
    const url = new URL(value);
    return SAFE_URL_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

export function safeUrlOrNull(value: unknown): string | null {
  return isSafeUrl(value) ? value : null;
}
