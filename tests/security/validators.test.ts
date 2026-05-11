import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isUuid,
  isValidSlug,
  asTrimmedString,
  asOptionalTrimmedString,
  asBool,
} from "@/lib/security/validators";

describe("isUuid", () => {
  it("accepts canonical v4 UUIDs (case-insensitive)", () => {
    assert.equal(isUuid("550e8400-e29b-41d4-a716-446655440000"), true);
    assert.equal(isUuid("550E8400-E29B-41D4-A716-446655440000"), true);
  });

  it("rejects malformed and non-string values", () => {
    assert.equal(isUuid("550e8400e29b41d4a716446655440000"), false);
    assert.equal(isUuid("not-a-uuid"), false);
    assert.equal(isUuid(""), false);
    assert.equal(isUuid(null), false);
    assert.equal(isUuid(42), false);
  });
});

describe("isValidSlug", () => {
  it("accepts kebab-case slugs", () => {
    assert.equal(isValidSlug("hello"), true);
    assert.equal(isValidSlug("hello-world"), true);
    assert.equal(isValidSlug("post-123"), true);
  });

  it("rejects slugs with leading/trailing hyphens or invalid chars", () => {
    assert.equal(isValidSlug("-hello"), false);
    assert.equal(isValidSlug("hello-"), false);
    assert.equal(isValidSlug("Hello"), false);
    assert.equal(isValidSlug("hello world"), false);
    assert.equal(isValidSlug("hello_world"), false);
    assert.equal(isValidSlug(""), false);
  });

  it("rejects slugs over 100 chars", () => {
    assert.equal(isValidSlug("a".repeat(100)), true);
    assert.equal(isValidSlug("a".repeat(101)), false);
  });
});

describe("asTrimmedString", () => {
  it("trims and accepts within bounds", () => {
    assert.equal(asTrimmedString("  hello  ", 100), "hello");
  });

  it("rejects empty after trim or over max length", () => {
    assert.equal(asTrimmedString("   ", 100), null);
    assert.equal(asTrimmedString("a".repeat(101), 100), null);
    assert.equal(asTrimmedString(null, 100), null);
    assert.equal(asTrimmedString(42, 100), null);
  });
});

describe("asOptionalTrimmedString", () => {
  it("returns empty for non-string", () => {
    assert.equal(asOptionalTrimmedString(null, 100), "");
    assert.equal(asOptionalTrimmedString(undefined, 100), "");
    assert.equal(asOptionalTrimmedString(42, 100), "");
  });

  it("trims and truncates to max", () => {
    assert.equal(asOptionalTrimmedString("  hi  ", 100), "hi");
    assert.equal(asOptionalTrimmedString("a".repeat(150), 100).length, 100);
  });
});

describe("asBool", () => {
  it("only true returns true", () => {
    assert.equal(asBool(true), true);
    assert.equal(asBool(false), false);
    assert.equal(asBool("true"), false);
    assert.equal(asBool(1), false);
    assert.equal(asBool(null), false);
  });
});
