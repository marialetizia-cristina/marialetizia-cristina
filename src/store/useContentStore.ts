import { create } from "zustand";
import { fetchPages, fetchProducts, fetchWorks, type CatalogProduct, type Page, type Work } from "../api/api";

let worksPromise: Promise<Work[]> | null = null;
let pagesPromise: Promise<Page[]> | null = null;
let productsPromise: Promise<CatalogProduct[]> | null = null;

interface ContentStoreState {
  works: Work[];
  worksLoading: boolean;
  worksLoaded: boolean;
  pages: Page[];
  pagesLoading: boolean;
  pagesLoaded: boolean;
  products: CatalogProduct[];
  productsLoading: boolean;
  productsLoaded: boolean;
  loadWorks: () => Promise<Work[]>;
  loadPages: () => Promise<Page[]>;
  loadProducts: () => Promise<CatalogProduct[]>;
  loadAll: () => Promise<Page[]>;
  getWorkById: (id: number) => Work | undefined;
  upsertWork: (work: Work) => void;
}

export const useContentStore = create<ContentStoreState>((set, get) => ({
  works: [],
  worksLoading: false,
  worksLoaded: false,
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

    set({ worksLoading: true });

    worksPromise = fetchWorks()
      .then(data => {
        set({ works: data, worksLoaded: true });
        return data;
      })
      .finally(() => {
        set({ worksLoading: false });
        worksPromise = null;
      });

    return worksPromise;
  },
  async loadPages() {
    if (get().pagesLoaded) {
      return get().pages;
    }

    if (pagesPromise) {
      return pagesPromise;
    }

    set({ pagesLoading: true });

    pagesPromise = fetchPages()
      .then(data => {
        set({ pages: data, pagesLoaded: true });
        return data;
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

    set({ productsLoading: true });
    productsPromise = fetchProducts()
      .then(data => {
        set({ products: data, productsLoaded: true });
        return data;
      })
      .catch(() => {
        set({ products: [], productsLoaded: true });
        return [];
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
    return get().works.find(work => work.id === id);
  },
  upsertWork(work) {
    set(state => {
      const existingIndex = state.works.findIndex(item => item.id === work.id);
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
