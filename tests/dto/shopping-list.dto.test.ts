import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseShoppingListInput,
  parseShoppingListItemInput,
} from "@/lib/dto/shopping-list.dto";

describe("parseShoppingListInput", () => {
  it("accepts a valid name", () => {
    const r = parseShoppingListInput({ name: "Cozinha" });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.value.name, "Cozinha");
  });

  it("rejects empty/blank name", () => {
    assert.equal(parseShoppingListInput({ name: "" }).ok, false);
    assert.equal(parseShoppingListInput({ name: "   " }).ok, false);
  });

  it("rejects non-object", () => {
    assert.equal(parseShoppingListInput(null).ok, false);
  });
});

describe("parseShoppingListItemInput", () => {
  const valid = {
    name: "Mixer",
    affiliate_url: "https://amazon.com.br/dp/x",
    image_url: "https://m.media-amazon.com/x.jpg",
    price: "R$ 199,90",
  };

  it("accepts a valid payload", () => {
    const r = parseShoppingListItemInput(valid);
    assert.equal(r.ok, true);
  });

  it("rejects unsafe affiliate URL", () => {
    const r = parseShoppingListItemInput({ ...valid, affiliate_url: "javascript:1" });
    assert.equal(r.ok, false);
  });

  it("rejects unsafe image URL", () => {
    const r = parseShoppingListItemInput({ ...valid, image_url: "data:image/png;base64,xxx" });
    assert.equal(r.ok, false);
  });

  it("accepts empty image_url as empty string", () => {
    const r = parseShoppingListItemInput({ ...valid, image_url: "" });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.value.image_url, "");
  });

  it("truncates absurdly long price", () => {
    const r = parseShoppingListItemInput({ ...valid, price: "R$ ".repeat(200) });
    assert.equal(r.ok, true);
    if (r.ok) assert.ok(r.value.price.length <= 50);
  });

  it("rejects empty name", () => {
    const r = parseShoppingListItemInput({ ...valid, name: "" });
    assert.equal(r.ok, false);
  });
});
