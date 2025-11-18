import { createPortal } from "react-dom";
import { useEffect } from "react";
import ImageSlider from "./ImageSlider";
import "../style/ImageModal.css";

interface ImageModalProps {
  images: string[];
  onClose: () => void;
}

const ImageModal = ({ images, onClose }: ImageModalProps) => {
  if (typeof document === "undefined") {
    return null;
  }

  useEffect(() => {
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

  return createPortal(
    <div className="image-modal__overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="image-modal"
        onClick={event => event.stopPropagation()}
      >
        <button type="button" className="image-modal__close" onClick={onClose} aria-label="Close image preview">
          &times;
        </button>
        <div className="image-modal__content">
          <ImageSlider images={images} autoPlay intervalMs={3500} className="image-slider--modal" />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageModal;
