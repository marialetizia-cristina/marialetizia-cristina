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
  const extractContentImages = useMemo(() => {
    if (!work.content?.rendered) return [] as string[];
    if (typeof window === "undefined") return [] as string[];

    const template = document.createElement("template");
    template.innerHTML = work.content.rendered;
    const nodes = Array.from(template.content.querySelectorAll<HTMLImageElement>("img"));
    return nodes.map(node => node.src).filter(Boolean);
  }, [work.content?.rendered]);

  const featured = work._embedded?.["wp:featuredmedia"]?.map(img => img.source_url) || [];
  const attachments = work._embedded?.["wp:attachment"]?.map(img => img.source_url) || [];

  const images = useMemo(() => {
    const merged = [...featured, ...attachments, ...extractContentImages];
    return merged.filter((url, index, arr) => url && arr.indexOf(url) === index);
  }, [featured, attachments, extractContentImages]);

  const isCaseStudy = work.categories?.includes(15);
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

  const content = (
    <>
      <ImageSlider images={images} autoPlay={!isCaseStudy} />
      <h3 dangerouslySetInnerHTML={{ __html: work.title.rendered }} />
    </>
  );

  return (
    <div className="masonry-item">
      {isCaseStudy ? (
        <Link to={`/single/${work.id}`} state={{ from: returnPath }}>
          {content}
        </Link>
      ) : (
        <div
          className="work-card__modal-trigger"
          role="button"
          tabIndex={0}
          onClick={handleOpenModal}
          onKeyDown={handleKeyDown}
        >
          {content}
        </div>
      )}
      {!isCaseStudy && isModalOpen && (
        <ImageModal images={images} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default WorkCard;