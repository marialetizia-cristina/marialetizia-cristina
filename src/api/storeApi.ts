const STORE_API_BASE_URL = "/wp-json/wc/store/v1/products";

interface StoreApiProduct {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  permalink: string;
  prices: {
    price: string;
    currency_code: string;
    currency_minor_unit: number;
    currency_prefix?: string;
    currency_suffix?: string;
  };
  images?: Array<{ src: string; alt?: string }>;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  formattedPrice: string;
  images: Array<{ src: string; alt?: string }>;
  permalink: string;
}

const normalizeProduct = (product: StoreApiProduct): Product => {
  const minorUnit = product.prices.currency_minor_unit ?? 2;
  const numericPrice = Number(product.prices.price) / (10 ** minorUnit);
  const price = Number.isFinite(numericPrice) ? numericPrice.toFixed(minorUnit) : "0.00";

  let formattedPrice: string;
  try {
    formattedPrice = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: product.prices.currency_code || "EUR",
    }).format(numericPrice);
  } catch {
    formattedPrice = `${product.prices.currency_prefix ?? "€"}${price}${product.prices.currency_suffix ?? ""}`;
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description || product.short_description || "",
    price,
    formattedPrice,
    images: product.images ?? [],
    permalink: product.permalink,
  };
};

const fetchStoreApi = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`WooCommerce Store API: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const products = await fetchStoreApi<StoreApiProduct[]>(`${STORE_API_BASE_URL}?per_page=100`);
  return products.map(normalizeProduct);
};

export const fetchProduct = async (productId: number): Promise<Product> => {
  const product = await fetchStoreApi<StoreApiProduct>(`${STORE_API_BASE_URL}/${productId}`);
  return normalizeProduct(product);
};
