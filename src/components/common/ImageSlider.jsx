import { useState } from "react";
import "./ImageSlider.css";

export default function ImageSlider({ images = [] }) {
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  return (
    <div className="slider">
      <img
        src={images[index]}
        alt="product"
        className="slider-image"
      />

      {/* DOTS */}
      {images.length > 1 && (
        <div className="dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={i === index ? "dot active" : "dot"}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
