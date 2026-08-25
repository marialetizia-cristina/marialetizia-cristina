import type { StoreApiMoney } from "../api/storeApi";

export function formatStoreMoney(value: string | undefined, money: StoreApiMoney, locale?: string): string {
  const parsed = Number(value ?? 0);
  const amount = Number.isFinite(parsed) ? parsed / 10 ** money.currency_minor_unit : 0;
  return new Intl.NumberFormat(locale, { style: "currency", currency: money.currency_code }).format(amount);
}
