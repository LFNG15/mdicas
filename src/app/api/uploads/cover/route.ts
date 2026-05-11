import type { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { withAdminAuth } from "@/lib/security/auth";
import { badRequest, ok, serverError, logError } from "@/lib/security/http";
import { getServiceClient } from "@/lib/supabase/server-client";

const BUCKET = "post-covers";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

// Verificação de "magic bytes" para os formatos aceitos.
// Evita upload de arquivos malformados ou disfarçados.
function detectMime(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) return "image/png";
  // WebP: "RIFF" .... "WEBP"
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return "image/webp";
  // AVIF: bytes 4-11 = "ftypavif" or "ftypheic"... we check "ftyp" + brand "avif"
  if (
    bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70 &&
    bytes[8] === 0x61 && bytes[9] === 0x76 && bytes[10] === 0x69 && bytes[11] === 0x66
  ) return "image/avif";
  return null;
}

export const POST = withAdminAuth(async (request: Request): Promise<NextResponse> => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest("Payload inválido (esperado multipart/form-data)");
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return badRequest("Campo 'file' ausente ou inválido");
  }
  if (file.size === 0) return badRequest("Arquivo vazio");
  if (file.size > MAX_BYTES) {
    return badRequest(`Arquivo excede o limite de ${MAX_BYTES / 1024 / 1024} MB`);
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return badRequest("Tipo de imagem não permitido (use JPEG, PNG, WebP ou AVIF)");
  }

  const buf = new Uint8Array(await file.arrayBuffer());
  const detected = detectMime(buf);
  if (!detected || detected !== file.type) {
    return badRequest("Conteúdo do arquivo não corresponde ao tipo declarado");
  }

  const ext = EXT_BY_MIME[detected];
  const objectKey = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${ext}`;

  const supabase = getServiceClient();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(objectKey, buf, {
      contentType: detected,
      cacheControl: "31536000, immutable",
      upsert: false,
    });

  if (uploadError) {
    logError("uploads:cover", uploadError);
    return serverError("Falha ao salvar a imagem");
  }

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(objectKey);
  if (!publicData?.publicUrl) {
    return serverError("Não foi possível gerar a URL pública");
  }

  return ok({ url: publicData.publicUrl, key: objectKey });
});
