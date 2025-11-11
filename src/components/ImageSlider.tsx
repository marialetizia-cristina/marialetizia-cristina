interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  if (!images || images.length === 0) return null;
  if (images.length === 1) return <img src={images[0]} alt="work" />;

  return (
    <div className="slider">
      {images.map((img, idx) => (
        <img key={idx} src={img} alt={`work ${idx + 1}`} />
      ))}
    </div>
  );
}
