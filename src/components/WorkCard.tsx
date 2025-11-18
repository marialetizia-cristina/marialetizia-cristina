import ImageSlider from "./ImageSlider";
import type { Work } from "../api/api";
import "../style/WorkCard.css";
import { Link } from "react-router-dom";

interface WorkCardProps {
  work: Work;
  returnPath?: string;
}

const WorkCard = ({ work, returnPath = "/category/all" }: WorkCardProps) => {
  // Array di immagini: per ora prendo solo la featured_media come cover
  const images = work._embedded?.['wp:featuredmedia']?.map(img => img.source_url) || [];

  return (
    <div className="masonry-item">
      <Link to={`/single/${work.id}`} state={{ from: returnPath }}>
        <ImageSlider images={images} />
        <h3>{work.title.rendered}</h3>
      </Link>
    </div>
  );
}

export default WorkCard;