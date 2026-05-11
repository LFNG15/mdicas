import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { sanitizeHtml, isSafeUrl, safeUrlOrNull } from "@/lib/security/sanitize";

describe("sanitizeHtml", () => {
  it("strips <script> tags", () => {
    const out = sanitizeHtml('<p>ok</p><script>alert(1)</script>');
    assert.equal(out.includes("<script"), false);
    assert.equal(out.includes("</script>"), false);
    assert.ok(out.includes("<p>ok</p>"));
  });

  it("strips <iframe>, <object>, <embed>", () => {
    const out = sanitizeHtml('<iframe src="x"></iframe><object></object><embed>');
    assert.equal(out.includes("<iframe"), false);
    assert.equal(out.includes("<object"), false);
    assert.equal(out.includes("<embed"), false);
  });

  it("removes inline event handlers", () => {
    const out = sanitizeHtml('<a href="/x" onclick="alert(1)">a</a>');
    assert.equal(out.includes("onclick"), false);
    assert.ok(out.includes('href="/x"'));
  });

  it("removes javascript: in href/src", () => {
    const out = sanitizeHtml('<a href="javascript:alert(1)">a</a>');
    assert.equal(/javascript:/i.test(out), false);
  });

  it("removes data: in href/src", () => {
    const out = sanitizeHtml('<img src="data:image/svg+xml,<svg/>">');
    assert.equal(out.includes("data:"), false);
  });

  it("returns empty string for non-string input", () => {
    // @ts-expect-error testing runtime guard
    assert.equal(sanitizeHtml(null), "");
    // @ts-expect-error testing runtime guard
    assert.equal(sanitizeHtml(undefined), "");
    // @ts-expect-error testing runtime guard
    assert.equal(sanitizeHtml(42), "");
  });

  it("preserves safe content", () => {
    const input = '<h2>Title</h2><p>Hello <strong>world</strong></p><a href="https://example.com">link</a>';
    assert.equal(sanitizeHtml(input), input);
  });
});

describe("isSafeUrl", () => {
  it("accepts http, https, mailto", () => {
    assert.equal(isSafeUrl("http://example.com"), true);
    assert.equal(isSafeUrl("https://example.com/x?a=1"), true);
    assert.equal(isSafeUrl("mailto:a@b.com"), true);
  });

  it("rejects javascript:, data:, file:, ftp:", () => {
    assert.equal(isSafeUrl("javascript:alert(1)"), false);
    assert.equal(isSafeUrl("data:text/html,<script>"), false);
    assert.equal(isSafeUrl("file:///etc/passwd"), false);
    assert.equal(isSafeUrl("ftp://example.com"), false);
  });

  it("rejects empty, non-string, and absurdly long values", () => {
    assert.equal(isSafeUrl(""), false);
    assert.equal(isSafeUrl(null), false);
    assert.equal(isSafeUrl(undefined), false);
    assert.equal(isSafeUrl(42), false);
    assert.equal(isSafeUrl("https://x/" + "a".repeat(3000)), false);
  });

  it("rejects malformed URLs", () => {
    assert.equal(isSafeUrl("not a url"), false);
    assert.equal(isSafeUrl("://example.com"), false);
  });
});

describe("safeUrlOrNull", () => {
  it("returns string when safe, null when not", () => {
    assert.equal(safeUrlOrNull("https://example.com"), "https://example.com");
    assert.equal(safeUrlOrNull("javascript:1"), null);
    assert.equal(safeUrlOrNull(null), null);
  });
});
