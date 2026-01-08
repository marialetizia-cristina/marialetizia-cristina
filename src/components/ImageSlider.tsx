import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SliderImage } from "../types/media";
import "../style/ImageSlider.css";

interface ImageSliderProps {
  images: SliderImage[];
  autoPlay?: boolean;
  intervalMs?: number;
  className?: string;
}

const ImageSlider = ({ images, autoPlay = false, intervalMs = 4500, className = "" }: ImageSliderProps) => {
  const validImages = useMemo(() => images.filter(image => Boolean(image?.src)), [images]);
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
        <img
          src={validImages[0].src}
          srcSet={validImages[0].srcSet}
          sizes={validImages[0].sizes}
          alt={validImages[0].alt ?? "work"}
          loading="eager"
          decoding="async"
        />
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
        {validImages.map((image, idx) => (
          <img
            key={image.src}
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.sizes}
            loading={idx === currentIndex ? "eager" : "lazy"}
            decoding="async"
            alt={image.alt ?? `work ${idx + 1}`}
            className={idx === currentIndex ? "slider__image slider__image--active" : "slider__image"}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`image-slider slider ${className}`.trim()}>
      {validImages.map((image, idx) => (
        <img
          key={image.src}
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.sizes}
          loading={idx === 0 ? "eager" : "lazy"}
          decoding="async"
          alt={image.alt ?? `work ${idx + 1}`}
        />
      ))}
    </div>
  );
};

export default ImageSlider;