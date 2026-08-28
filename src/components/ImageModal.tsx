import { createPortal } from "react-dom";
import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import ImageSlider from "./ImageSlider";
import type { SliderImage } from "../types/media";
import "../style/ImageModal.css";

interface ImageModalProps {
  images: SliderImage[];
  onClose: () => void;
  children?: ReactNode;
}

const ImageModal = ({ images, onClose, children }: ImageModalProps) => {
  const modalImages = useMemo(() => {
    const fallbackSizes = "(min-width: 768px) 80vw, 100vw";
    return images.map(image => (image.sizes ? image : { ...image, sizes: fallbackSizes }));
  }, [images]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="image-modal__overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className={`image-modal${children ? " image-modal--with-details" : ""}`}
        onClick={event => event.stopPropagation()}
      >
        <button type="button" className="image-modal__close" onClick={onClose} aria-label="Close image preview">
          &times;
        </button>
        <div className={`image-modal__content${children ? " image-modal__content--with-details" : ""}`}>
          <div className="image-modal__gallery">
            <ImageSlider images={modalImages} autoPlay intervalMs={2500} className="image-slider--modal" />
          </div>
          {children && <div className="image-modal__details">{children}</div>}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageModal;
