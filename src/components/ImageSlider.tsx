import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (!autoPlay || validImages.length <= 1) {
      stopAutoPlay();
      return;
    }

    stopAutoPlay();
    timerRef.current = window.setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % validImages.length);
    }, intervalMs);
  }, [autoPlay, intervalMs, stopAutoPlay, validImages.length]);

  useEffect(() => {
    startAutoPlay();

    return () => {
      stopAutoPlay();
    };
  }, [startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    if (currentIndex >= validImages.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, validImages.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [validImages.length]);

  if (!validImages || validImages.length === 0) return null;
  if (!autoPlay && validImages.length === 1) {
    return (
      <div className={`image-slider ${className}`.trim()}>
        <img src={validImages[0]} alt="work" />
      </div>
    );
  }

  if (autoPlay) {
    const handleMouseEnter = () => {
      stopAutoPlay();
    };

    const handleMouseLeave = () => {
      startAutoPlay();
    };
    const handleNext = () => {
      if (validImages.length > 1) {
        setCurrentIndex(prev => (prev + 1) % validImages.length);
        startAutoPlay();
      }
    };

    return (
      <div
        className={`image-slider slider slider--auto ${className}`.trim()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        onClick={handleNext}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
            event.preventDefault();
            handleNext();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Avanza all'immagine successiva"
      >
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