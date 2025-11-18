import { useEffect, useMemo, useRef, useState } from "react";
import "../style/ImageSlider.css";

interface ImageSliderProps {
  images: string[];
  autoPlay?: boolean;
  intervalMs?: number;
  className?: string;
}

const ImageSlider = ({ images, autoPlay = false, intervalMs = 3000, className = "" }: ImageSliderProps) => {
  const validImages = useMemo(() => images.filter(Boolean), [images]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoPlay || validImages.length <= 1) {
      return;
    }

    timerRef.current = window.setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % validImages.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [autoPlay, intervalMs, validImages.length]);

  useEffect(() => {
    if (currentIndex >= validImages.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, validImages.length]);

  if (!validImages || validImages.length === 0) return null;
  if (!autoPlay && validImages.length === 1) {
    return (
      <div className={`image-slider ${className}`.trim()}>
        <img src={validImages[0]} alt="work" />
      </div>
    );
  }

  if (autoPlay) {
    return (
      <div className={`image-slider slider slider--auto ${className}`.trim()}>
        {validImages.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`work ${idx + 1}`}
            className={idx === currentIndex ? "slider__image slider__image--active" : "slider__image"}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`image-slider slider ${className}`.trim()}>
      {validImages.map((img, idx) => (
        <img key={idx} src={img} alt={`work ${idx + 1}`} />
      ))}
    </div>
  );
};

export default ImageSlider;