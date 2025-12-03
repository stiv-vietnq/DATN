import { useEffect, useState, useRef, type ReactNode, isValidElement } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import "./Slider.css";

interface SliderProps {
  children: ReactNode[];
}

export default function Slider({ children }: SliderProps) {
  const totalSlides = children.length;

  // Clone đầu và cuối để tạo infinite
  const slides = [children[totalSlides - 1], ...children, children[0]];

  const [activeIndex, setActiveIndex] = useState(1); // start từ slide thực đầu tiên
  const [isTransitioning, setIsTransitioning] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setActiveIndex((prev) => prev + 1);
    setIsTransitioning(true);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => prev - 1);
    setIsTransitioning(true);
  };

  const startAutoSlide = () => {
    stopAutoSlide(); // tránh tạo nhiều interval
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Khởi tạo auto slide
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  // Xử lý khi chuyển slide clone
  const handleTransitionEnd = () => {
    if (activeIndex === 0) {
      // nếu đang ở clone cuối, nhảy sang slide cuối thực
      setIsTransitioning(false);
      setActiveIndex(totalSlides);
    } else if (activeIndex === totalSlides + 1) {
      // nếu đang ở clone đầu, nhảy về slide đầu thực
      setIsTransitioning(false);
      setActiveIndex(1);
    }
  };

  // Click vào dot hoặc title
  const goToSlide = (index: number) => {
    setActiveIndex(index + 1); // vì index thực bắt đầu từ 1
    setIsTransitioning(true);
  };

  return (
    <div className="slider">
      <div
        className="container__slider"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        <div
          className="slider__track"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((item, i) => (
            <div className="slider__item" key={i}>
              {item}
            </div>
          ))}
        </div>

        <button className="slider__btn-prev" onClick={prevSlide}>
          <FaChevronLeft />
        </button>
        <button className="slider__btn-next" onClick={nextSlide}>
          <FaChevronRight />
        </button>
      </div>

      {/* Titles */}
      <div className="container__slider__titles">
        {children.map((child, index) => {
          if (!isValidElement(child)) return null;
          const element = child as React.ReactElement<{ "data-title"?: string; alt?: string }>;
          const title = element.props["data-title"] || element.props.alt || "";
          return (
            <div
              key={index}
              className={
                activeIndex - 1 === index
                  ? "slider-title-item slider-title-item-active"
                  : "slider-title-item"
              }
              onClick={() => goToSlide(index)}
            >
              {title}
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="container__slider__links">
        {children.map((_, i) => (
          <button
            key={i}
            className={
              activeIndex - 1 === i
                ? "container__slider__links-small container__slider__links-small-active"
                : "container__slider__links-small"
            }
            onClick={() => goToSlide(i)}
          ></button>
        ))}
      </div>
    </div>
  );
}
