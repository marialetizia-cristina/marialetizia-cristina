import type { WPEmbeddedMedia, WPImageSize } from "../api/api";
import type { SliderImage } from "../types/media";

const stripHtml = (value?: string | null): string | undefined => {
  if (!value) {
    return undefined;
  }

  return value.replace(/<[^>]*>/g, "").trim() || undefined;
};

const collectSizes = (sizes?: Record<string, WPImageSize>): WPImageSize[] => {
  if (!sizes) {
    return [];
  }

  const seen = new Map<string, WPImageSize>();
  Object.values(sizes).forEach(size => {
    if (!size?.source_url) {
      return;
    }

    const width = Number(size.width);
    if (!Number.isFinite(width) || width <= 0) {
      return;
    }

    const existing = seen.get(size.source_url);
    if (!existing || width > existing.width) {
      seen.set(size.source_url, { ...size, width });
    }
  });
  return Array.from(seen.values()).sort((a, b) => a.width - b.width);
};

interface BuildSliderImageOptions {
  fallbackAlt?: string;
  sizes?: string;
}

export const buildSliderImage = (
  media: WPEmbeddedMedia | null | undefined,
  { fallbackAlt, sizes }: BuildSliderImageOptions = {}
): SliderImage | null => {
  if (!media?.source_url) {
    return null;
  }

  const originalWidth = Number(media.media_details?.width);
  const responsiveSizes = collectSizes(media.media_details?.sizes);
  const srcSetParts = responsiveSizes.map(size => `${size.source_url} ${Math.round(size.width)}w`);

  if (Number.isFinite(originalWidth) && originalWidth > 0 && !responsiveSizes.some(size => size.source_url === media.source_url)) {
    srcSetParts.push(`${media.source_url} ${Math.round(originalWidth)}w`);
  }

  const alt = stripHtml(media.alt_text) || stripHtml(media.title?.rendered) || stripHtml(fallbackAlt);

  return {
    src: media.source_url,
    srcSet: srcSetParts.length > 0 ? srcSetParts.join(", ") : undefined,
    sizes,
    alt,
  };
};

export const dedupeSliderImages = (images: SliderImage[]): SliderImage[] => {
  const deduped = new Map<string, SliderImage>();

  const normalizeSrcSet = (value?: string): string | undefined => {
    if (!value) {
      return undefined;
    }

    const parts = value
      .split(",")
      .map(part => part.trim())
      .filter(Boolean);

    return parts.length ? parts.join(", ") : undefined;
  };

  const mergeSrcSet = (first?: string, second?: string): string | undefined => {
    const normalize = (value?: string): Array<{ url: string; descriptor?: string; width?: number }> => {
      if (!value) {
        return [];
      }

      return value
        .split(",")
        .map(entry => entry.trim())
        .filter(Boolean)
        .map(entry => {
          const [url, descriptor] = entry.split(/\s+/);
          const width = descriptor ? Number.parseInt(descriptor, 10) : undefined;

          return { url, descriptor, width: Number.isFinite(width) ? width : undefined };
        })
        .filter(item => Boolean(item.url));
    };

    const catalog = new Map<string, { descriptor?: string; width?: number }>();

    normalize(first).forEach(item => {
      catalog.set(item.url, { descriptor: item.descriptor, width: item.width });
    });

    normalize(second).forEach(item => {
      const existing = catalog.get(item.url);
      if (!existing || (item.width && (!existing.width || item.width > existing.width))) {
        catalog.set(item.url, { descriptor: item.descriptor, width: item.width });
      }
    });

    const merged = Array.from(catalog.entries())
      .map(([url, meta]) => ({ url, descriptor: meta.descriptor, width: meta.width ?? 0 }))
      .sort((a, b) => (a.width ?? 0) - (b.width ?? 0))
      .map(item => (item.descriptor ? `${item.url} ${item.descriptor}` : item.url));

    return merged.length ? merged.join(", ") : undefined;
  };

  images.forEach(image => {
    const src = image?.src?.trim();
    if (!src) {
      return;
    }

    const normalized: SliderImage = {
      ...image,
      src,
      alt: image.alt?.trim() || undefined,
      sizes: image.sizes?.trim() || undefined,
      srcSet: normalizeSrcSet(image.srcSet),
    };

    const existing = deduped.get(src);
    if (existing) {
      const merged: SliderImage = {
        ...existing,
        ...normalized,
        src,
        alt: normalized.alt ?? existing.alt,
        sizes: normalized.sizes ?? existing.sizes,
        srcSet: mergeSrcSet(existing.srcSet, normalized.srcSet),
      };

      deduped.set(src, merged);
    } else {
      deduped.set(src, normalized);
    }
  });

  return Array.from(deduped.values());
};
