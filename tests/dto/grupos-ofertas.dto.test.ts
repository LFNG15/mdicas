import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseGrupoOfertaInput } from "@/lib/dto/grupos-ofertas.dto";

describe("parseGrupoOfertaInput", () => {
  it("accepts whatsapp and telegram (case-insensitive)", () => {
    const a = parseGrupoOfertaInput({ platform: "WHATSAPP", name: "Grupo A", url: "https://chat.whatsapp.com/abc" });
    assert.equal(a.ok, true);
    if (a.ok) assert.equal(a.value.platform, "whatsapp");

    const b = parseGrupoOfertaInput({ platform: "telegram", name: "Grupo B", url: "https://t.me/x" });
    assert.equal(b.ok, true);
  });

  it("rejects unsupported platforms", () => {
    const r = parseGrupoOfertaInput({ platform: "discord", name: "x", url: "https://x.com" });
    assert.equal(r.ok, false);
  });

  it("rejects unsafe URLs", () => {
    const r = parseGrupoOfertaInput({ platform: "telegram", name: "x", url: "javascript:alert(1)" });
    assert.equal(r.ok, false);
  });

  it("rejects empty name", () => {
    const r = parseGrupoOfertaInput({ platform: "telegram", name: "  ", url: "https://t.me/x" });
    assert.equal(r.ok, false);
  });

  it("rejects non-object", () => {
    assert.equal(parseGrupoOfertaInput(null).ok, false);
    assert.equal(parseGrupoOfertaInput("x").ok, false);
  });
});
