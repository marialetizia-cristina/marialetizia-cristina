import { create } from "zustand";
import {
  fetchFeaturedWorks,
  fetchPages,
  fetchProducts,
  fetchWorks,
  type CatalogProduct,
  type Page,
  type Work,
} from "../api/api";

let worksPromise: Promise<Work[]> | null = null;
let featuredWorksPromise: Promise<Work[]> | null = null;
let pagesPromise: Promise<Page[]> | null = null;
let productsPromise: Promise<CatalogProduct[]> | null = null;

export type ContentCollection = "works" | "featuredWorks" | "pages" | "products";

interface ContentStoreState {
  errors: Partial<Record<ContentCollection, boolean>>;
  works: Work[];
  worksLoading: boolean;
  worksLoaded: boolean;

  featuredWorks: Work[];
  featuredWorksLoading: boolean;
  featuredWorksLoaded: boolean;

  pages: Page[];
  pagesLoading: boolean;
  pagesLoaded: boolean;

  products: CatalogProduct[];
  productsLoading: boolean;
  productsLoaded: boolean;

  loadWorks: () => Promise<Work[]>;
  loadFeaturedWorks: () => Promise<Work[]>;
  loadPages: () => Promise<Page[]>;
  loadProducts: () => Promise<CatalogProduct[]>;
  loadAll: () => Promise<Page[]>;

  getWorkById: (id: number) => Work | undefined;
  upsertWork: (work: Work) => void;
}

export const useContentStore = create<ContentStoreState>((set, get) => ({
  errors: {},
  works: [],
  worksLoading: false,
  worksLoaded: false,
  featuredWorks: [],
  featuredWorksLoading: false,
  featuredWorksLoaded: false,
  pages: [],
  pagesLoading: false,
  pagesLoaded: false,
  products: [],
  productsLoading: false,
  productsLoaded: false,
  async loadWorks() {
    if (get().worksLoaded) {
      return get().works;
    }

    if (worksPromise) {
      return worksPromise;
    }

    set(state => ({ worksLoading: true, errors: { ...state.errors, works: false } }));

    worksPromise = fetchWorks()
      .then((data) => {
        set({ works: data, worksLoaded: true });
        return data;
      })
      .catch(() => {
        set(state => ({ errors: { ...state.errors, works: true } }));
        return get().works;
      })
      .finally(() => {
        set({ worksLoading: false });
        worksPromise = null;
      });

    return worksPromise;
  },
  async loadFeaturedWorks() {
    if (get().featuredWorksLoaded) {
      return get().featuredWorks;
    }

    if (featuredWorksPromise) {
      return featuredWorksPromise;
    }

    set(state => ({ featuredWorksLoading: true, errors: { ...state.errors, featuredWorks: false } }));

    featuredWorksPromise = fetchFeaturedWorks()
      .then((data) => {
        set({
          featuredWorks: data,
          featuredWorksLoaded: true,
        });

        return data;
      })
      .catch(() => {
        set(state => ({ errors: { ...state.errors, featuredWorks: true } }));
        return get().featuredWorks;
      })
      .finally(() => {
        set({ featuredWorksLoading: false });
        featuredWorksPromise = null;
      });

    return featuredWorksPromise;
  },
  async loadPages() {
    if (get().pagesLoaded) {
      return get().pages;
    }

    if (pagesPromise) {
      return pagesPromise;
    }

    set(state => ({ pagesLoading: true, errors: { ...state.errors, pages: false } }));

    pagesPromise = fetchPages()
      .then((data) => {
        set({ pages: data, pagesLoaded: true });
        return data;
      })
      .catch(() => {
        set(state => ({ errors: { ...state.errors, pages: true } }));
        return get().pages;
      })
      .finally(() => {
        set({ pagesLoading: false });
        pagesPromise = null;
      });

    return pagesPromise;
  },
  async loadProducts() {
    if (get().productsLoaded) return get().products;
    if (productsPromise) return productsPromise;

    set(state => ({ productsLoading: true, errors: { ...state.errors, products: false } }));
    productsPromise = fetchProducts()
      .then((data) => {
        set({ products: data, productsLoaded: true });
        return data;
      })
      .catch(() => {
        set(state => ({ errors: { ...state.errors, products: true } }));
        return get().products;
      })
      .finally(() => {
        set({ productsLoading: false });
        productsPromise = null;
      });

    return productsPromise;
  },
  async loadAll() {
    const pagesPromise = get().loadPages();
    void get().loadWorks();
    void get().loadProducts();
    return pagesPromise;
  },
  getWorkById(id) {
    return get().works.find((work) => work.id === id);
  },
  upsertWork(work) {
    set((state) => {
      const existingIndex = state.works.findIndex(
        (item) => item.id === work.id,
      );
      if (existingIndex === -1) {
        return {
          works: [...state.works, work],
          worksLoaded: true,
        };
      }

      const nextWorks = state.works.slice();
      nextWorks[existingIndex] = work;
      return {
        works: nextWorks,
        worksLoaded: true,
      };
    });
  },
}));
