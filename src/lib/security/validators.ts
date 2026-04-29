const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,98}[a-z0-9])?$/;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

export function isValidSlug(value: unknown): value is string {
  return typeof value === "string" && SLUG_RE.test(value);
}

export function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > max) return null;
  return trimmed;
}

export function asOptionalTrimmedString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

export function asBool(value: unknown): boolean {
  return value === true;
}
