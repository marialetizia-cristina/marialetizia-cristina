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

  images.forEach(image => {
    const src = image?.src?.trim();
    if (!src) {
      return;
    }

    const existing = deduped.get(src);
    if (existing) {
      deduped.set(src, { ...existing, ...image, src });
    } else {
      deduped.set(src, { ...image, src });
    }
  });

  return Array.from(deduped.values());
};
