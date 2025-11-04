import { useEffect, useState, type ReactNode, isValidElement } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import "./Slider.css";

interface SliderProps {
  children: ReactNode[];
}

export default function Slider({ children }: SliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const totalSlides = children.length;

  // Tự động chuyển slide
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 3000);
    setTimer(id);
    return () => clearInterval(id);
  }, [totalSlides]);

  // Chuyển ảnh thủ công
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  // Dừng tự động khi hover
  const pause = () => {
    if (timer) clearInterval(timer);
  };

  const resume = () => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 3000);
    setTimer(id);
  };

  return (
    <div className="slider">
      <div
        className="container__slider"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div
          className="slider__track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {children.map((item, i) => (
            <div className="slider__item" key={i}>
              {item}
            </div>
          ))}
        </div>

        <button className="slider__btn-prev" onClick={handlePrev}>
          <FaChevronLeft />
        </button>
        <button className="slider__btn-next" onClick={handleNext}>
          <FaChevronRight />
        </button>
      </div>

      {/* ----- Tên thương hiệu (hoặc "tên của t" 😄) ----- */}
      <div className="container__slider__titles">
        {children.map((child, index) => {
          if (!isValidElement(child)) return null;
          const element = child as React.ReactElement<{ "data-title"?: string; alt?: string }>;
          const title = element.props["data-title"] || element.props.alt || "";
          return (
            <div
              key={index}
              className={
                activeIndex === index
                  ? "slider-title-item slider-title-item-active"
                  : "slider-title-item"
              }
              onClick={() => setActiveIndex(index)}
            >
              {title}
            </div>
          );
        })}
      </div>

      {/* ----- Các dot nhỏ ----- */}
      <div className="container__slider__links">
        {children.map((_, i) => (
          <button
            key={i}
            className={
              activeIndex === i
                ? "container__slider__links-small container__slider__links-small-active"
                : "container__slider__links-small"
            }
            onClick={() => setActiveIndex(i)}
          ></button>
        ))}
      </div>
    </div>
  );
}
