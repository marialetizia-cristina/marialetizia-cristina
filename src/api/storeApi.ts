const STORE_API_BASE = `${(import.meta.env.VITE_WORDPRESS_REST_URL ?? "https://marialetizia.netsons.org/wp-json").replace(/\/$/, "")}/wc/store/v1`;
const CART_TOKEN_KEY = "portfolio-letizia-cart-token";

export interface StoreApiMoney { price?: string; line_total?: string; total_price?: string; currency_code: string; currency_symbol: string; currency_minor_unit: number; currency_decimal_separator: string; currency_thousand_separator: string; currency_prefix: string; currency_suffix: string; }
export interface StoreApiCartItem { key: string; id: number; quantity: number; name: string; images: Array<{ src: string; alt: string }>; prices: StoreApiMoney; totals: StoreApiMoney; item_data: Array<{ key: string; value: string }>; }
export interface StoreApiCart { items: StoreApiCartItem[]; items_count: number; needs_payment: boolean; needs_shipping: boolean; totals: StoreApiMoney; payment_methods: string[]; errors: Array<{ code: string; message: string }>; }
export interface CheckoutAddress { first_name: string; last_name: string; company?: string; address_1: string; address_2?: string; city: string; state?: string; postcode: string; country: string; email?: string; phone?: string; }
export interface CheckoutPayload { billing_address: CheckoutAddress; shipping_address: CheckoutAddress; payment_method: string; payment_data: Array<{ key: string; value: string }>; customer_note?: string; }
export interface CheckoutResponse { order_id: number; status: string; order_key: string; payment_result?: { payment_status: string; redirect_url: string; payment_details: Array<{ key: string; value: string }> }; }

export class StoreApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.name = "StoreApiError"; this.status = status; }
}

function getCartToken(): string | null { return typeof window === "undefined" ? null : window.localStorage.getItem(CART_TOKEN_KEY); }

async function cartRequest(path: string, init?: RequestInit): Promise<StoreApiCart> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  const token = getCartToken();
  if (token) headers.set("Cart-Token", token);
  const response = await fetch(`${STORE_API_BASE}${path}`, { ...init, headers });
  const nextToken = response.headers.get("Cart-Token");
  if (nextToken && typeof window !== "undefined") window.localStorage.setItem(CART_TOKEN_KEY, nextToken);
  const body = await response.json().catch(() => null) as ({ message?: string } | StoreApiCart | null);
  if (!response.ok) throw new StoreApiError(body && "message" in body ? body.message ?? "Errore carrello." : "Errore carrello.", response.status);
  return body as StoreApiCart;
}

export async function processCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  const headers = new Headers({ "Content-Type": "application/json" });
  const token = getCartToken();
  if (!token) throw new StoreApiError("La sessione del carrello non è disponibile.", 400);
  headers.set("Cart-Token", token);
  const response = await fetch(`${STORE_API_BASE}/checkout`, { method: "POST", headers, body: JSON.stringify(payload) });
  const body = await response.json().catch(() => null) as ({ message?: string } | CheckoutResponse | null);
  if (!response.ok) throw new StoreApiError(body && "message" in body ? body.message ?? "Checkout non riuscito." : "Checkout non riuscito.", response.status);
  return body as CheckoutResponse;
}

export const getCart = () => cartRequest("/cart");
export const addCartItem = (id: number, portfolioCustomization: Record<string, string>, attachmentTokens: string[] = [], quantity = 1) => cartRequest("/cart/add-item", { method: "POST", body: JSON.stringify({ id, quantity, portfolio_customization: portfolioCustomization, portfolio_attachment_tokens: attachmentTokens }) });
export const updateCartItem = (key: string, quantity: number) => cartRequest("/cart/update-item", { method: "POST", body: JSON.stringify({ key, quantity }) });
export const removeCartItem = (key: string) => cartRequest("/cart/remove-item", { method: "POST", body: JSON.stringify({ key }) });
