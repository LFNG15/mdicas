import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseInstagramInput } from "@/lib/dto/instagram.dto";

describe("parseInstagramInput", () => {
  it("accepts a valid payload", () => {
    const r = parseInstagramInput({
      url: "https://instagram.com/p/abc",
      image_url: "https://cdninstagram.com/x.jpg",
      caption: "Legenda",
    });
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.value.caption, "Legenda");
    }
  });

  it("rejects unsafe URL", () => {
    const r = parseInstagramInput({
      url: "javascript:1",
      image_url: "https://x/y.jpg",
      caption: "",
    });
    assert.equal(r.ok, false);
  });

  it("rejects unsafe image URL", () => {
    const r = parseInstagramInput({
      url: "https://instagram.com/p/abc",
      image_url: "data:image/png;base64,xxx",
      caption: "",
    });
    assert.equal(r.ok, false);
  });

  it("accepts missing caption (treats as empty)", () => {
    const r = parseInstagramInput({
      url: "https://instagram.com/p/abc",
      image_url: "https://cdninstagram.com/x.jpg",
    });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.value.caption, "");
  });
});
