import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parsePostInput } from "@/lib/dto/post.dto";

const valid = {
  slug: "meu-post",
  title: "Título",
  excerpt: "Resumo do artigo",
  content: "<p>Conteúdo</p>",
  category: "Lifestyle",
  tag: "Bem-Estar",
  author: "Ana",
  date: "2026-05-11",
  readTime: "5 min",
  gradient: "linear-gradient(135deg, #fff, #000)",
  featured: true,
  featuredMain: false,
};

describe("parsePostInput", () => {
  it("accepts a valid payload", () => {
    const r = parsePostInput(valid);
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.value.slug, "meu-post");
      assert.equal(r.value.featured, true);
      assert.equal(r.value.featuredMain, false);
    }
  });

  it("rejects non-object payloads", () => {
    assert.equal(parsePostInput(null).ok, false);
    assert.equal(parsePostInput("string").ok, false);
    assert.equal(parsePostInput(42).ok, false);
  });

  it("rejects invalid slug", () => {
    const r = parsePostInput({ ...valid, slug: "Invalid Slug!" });
    assert.equal(r.ok, false);
    if (!r.ok) assert.match(r.error, /Slug/i);
  });

  it("rejects missing/empty title", () => {
    const r = parsePostInput({ ...valid, title: "   " });
    assert.equal(r.ok, false);
  });

  it("rejects content over 200k chars", () => {
    const r = parsePostInput({ ...valid, content: "a".repeat(200_001) });
    assert.equal(r.ok, false);
  });

  it("sanitizes content (strips <script>)", () => {
    const r = parsePostInput({ ...valid, content: '<p>ok</p><script>alert(1)</script>' });
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.value.content.includes("<script"), false);
      assert.ok(r.value.content.includes("<p>ok</p>"));
    }
  });

  it("coerces non-boolean flags to false", () => {
    const r = parsePostInput({ ...valid, featured: "yes", featuredMain: 1 });
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.value.featured, false);
      assert.equal(r.value.featuredMain, false);
    }
  });
});
