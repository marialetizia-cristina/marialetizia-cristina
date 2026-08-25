import { describe, expect, it } from "vitest";
import { formatStoreMoney } from "./money";
import type { StoreApiMoney } from "../api/storeApi";

const euro: StoreApiMoney = {
  currency_code: "EUR",
  currency_symbol: "€",
  currency_minor_unit: 2,
  currency_decimal_separator: ",",
  currency_thousand_separator: ".",
  currency_prefix: "",
  currency_suffix: " €",
};

describe("formatStoreMoney", () => {
  it("converts Store API minor units", () => {
    expect(formatStoreMoney("1299", euro, "it-IT")).toBe("12,99 €");
  });

  it("does not expose NaN for malformed values", () => {
    expect(formatStoreMoney("invalid", euro, "it-IT")).toBe("0,00 €");
  });
});
