import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import ImageModal from "./ImageModal";
import type { CatalogProduct, Work, WPEmbeddedMedia } from "../api/api";
import type { SliderImage } from "../types/media";
import { buildSliderImage, dedupeSliderImages } from "../utils/wpMedia";
import "../style/WorkCard.css";
import { isCaseStudyCategory } from "../utils/categories";
import ProjectCommerce from "./ProjectCommerce";
import { useTranslation } from "react-i18next";

interface WorkCardProps {
  work: Work;
  product?: CatalogProduct;
  returnPath?: string;
}

const WorkCard = ({ work, product, returnPath = "/category/all" }: WorkCardProps) => {
  const { t } = useTranslation();
  const sliderSizes = "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw";

  const plainTitle = useMemo(() => {
    return work.title.rendered.replace(/<[^>]*>/g, "").trim();
  }, [work.title.rendered]);

  const contentImages = useMemo(() => {
    if (typeof window === "undefined") return [] as SliderImage[];
    if (!work.content?.rendered) return [] as SliderImage[];

    const template = document.createElement("template");
    template.innerHTML = work.content.rendered;
    const nodes = Array.from(template.content.querySelectorAll<HTMLImageElement>("img"));
    return nodes
      .map(node => {
        const src = node.src || node.getAttribute("src") || "";
        if (!src) {
          return null;
        }

        const altAttribute = node.getAttribute("alt")?.trim();
        const image: SliderImage = {
          src,
          alt: altAttribute || plainTitle || undefined,
          sizes: sliderSizes,
        };

        return image;
      })
      .filter((image): image is SliderImage => Boolean(image));
  }, [work.content?.rendered, plainTitle, sliderSizes]);

  const buildMediaImage = (media: WPEmbeddedMedia | undefined): SliderImage | null => {
    return buildSliderImage(media, { fallbackAlt: plainTitle, sizes: sliderSizes });
  };

  const featuredMedia = work._embedded?.["wp:featuredmedia"] ?? [];
  const attachmentsMedia = work._embedded?.["wp:attachment"] ?? [];

  const featured = featuredMedia
    .map(buildMediaImage)
    .filter((image): image is SliderImage => Boolean(image));

  const attachments = attachmentsMedia
    .map(buildMediaImage)
    .filter((image): image is SliderImage => Boolean(image));

  const images = useMemo(() => {
    const merged = [...featured, ...attachments, ...contentImages];
    return dedupeSliderImages(merged);
  }, [featured, attachments, contentImages]);

  const isCaseStudy = isCaseStudyCategory(work.categories ?? []);
  const isCommercial = product?.flow === "variable_quote" || product?.flow === "fixed_purchase";
  const heroImages = useMemo(() => {
    if (!images.length) {
      return images;
    }

    if (isCaseStudy) {
      return [images[0]];
    }

    return images;
  }, [images, isCaseStudy]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (!isCaseStudy && images.length > 0) {
      setIsModalOpen(true);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenModal();
    }
  };

  const cardMarkup = (
    <div className="work-card">
      <div className="work-card__media">
        <ImageSlider images={heroImages} autoPlay={!isCaseStudy} />
        {isCommercial && (
          <div className="work-card__overlay">
            <p className="work-card__commission-note">{t("product.commissionNotice")}</p>
          </div>
        )}
      </div>
      <div className="work-card__commerce-summary">
        <div className="work-card__commerce-line">
          <h3 dangerouslySetInnerHTML={{ __html: work.title.rendered }} />
          {isCommercial && (
            <>
            <span aria-hidden="true">—</span>
            <div className="work-card__price">
              <span>{product.flow === "variable_quote" ? t("product.indicativePriceLabel") : t("product.priceLabel")} </span>
              {product.flow === "fixed_purchase" && product.price_html ? (
                <span dangerouslySetInnerHTML={{ __html: product.price_html }} />
              ) : (
                product.indicative_price_range || t("products.priceOnRequest")
              )}
            </div>
            </>
          )}
          {!isCommercial && (
            <>
              <span aria-hidden="true">—</span>
              <div className="work-card__price">{t("product.notForSale")}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="masonry-item">
      {isCaseStudy ? (
        <Link to={`/single/${work.id}`} state={{ from: returnPath }}>
          {cardMarkup}
        </Link>
      ) : (
        <div
          className="work-card__modal-trigger"
          role="button"
          tabIndex={0}
          onClick={handleOpenModal}
          onKeyDown={handleKeyDown}
        >
          {cardMarkup}
        </div>
      )}
      {!isCaseStudy && isModalOpen && (
        <ImageModal images={images} onClose={() => setIsModalOpen(false)}>
          {product && <ProjectCommerce product={product} projectTitle={plainTitle} />}
        </ImageModal>
      )}
    </div>
  );
}

export default WorkCard;
