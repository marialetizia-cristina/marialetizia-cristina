import ImageSlider from "./ImageSlider";
import type { Work } from "../api/api";
import "../style/WorkCard.css";

interface WorkCardProps {
  work: Work;
}

const WorkCard = ({ work }: WorkCardProps) => {
  // Array di immagini: per ora prendo solo la featured_media come cover
  const images = work._embedded?.['wp:featuredmedia']?.map(img => img.source_url) || [];

  return (
    <div className="masonry-item">
      <ImageSlider images={images} />
      <h3>{work.title.rendered}</h3>
    </div>
  );
}

export default WorkCard;