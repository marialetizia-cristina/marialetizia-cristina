import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import ImageModal from "./ImageModal";
import type { Work } from "../api/api";
import "../style/WorkCard.css";

interface WorkCardProps {
  work: Work;
  returnPath?: string;
}

const WorkCard = ({ work, returnPath = "/category/all" }: WorkCardProps) => {
  const contentImages = useMemo(() => {
    if (typeof window === "undefined") return [] as string[];
    if (!work.content?.rendered) return [] as string[];

    const template = document.createElement("template");
    template.innerHTML = work.content.rendered;
    const nodes = Array.from(template.content.querySelectorAll<HTMLImageElement>("img"));
    return nodes.map(node => node.src).filter(Boolean);
  }, [work.content?.rendered]);

  const featured = work._embedded?.["wp:featuredmedia"]?.map(img => img.source_url) || [];
  const attachments = work._embedded?.["wp:attachment"]?.map(img => img.source_url) || [];

  const images = useMemo(() => {
    const merged = [...featured, ...attachments, ...contentImages];
    return merged.filter((url, index, arr) => url && arr.indexOf(url) === index);
  }, [featured, attachments, contentImages]);

  const isCaseStudy = work.categories?.includes(15);
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
        <div className="work-card__overlay">
          <h3 dangerouslySetInnerHTML={{ __html: work.title.rendered }} />
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
        <ImageModal images={images} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default WorkCard;