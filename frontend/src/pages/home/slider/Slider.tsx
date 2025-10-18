import { useEffect, useState, type ReactNode, isValidElement } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import "./Slider.css";

interface SliderProps {
  children: ReactNode[];
}

export default function Slider({ children }: SliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDone, setSlideDone] = useState(true);
  const [timeID, setTimeID] = useState<NodeJS.Timeout | null>(null);
  const [directionForward, setDirectionForward] = useState(true);

  useEffect(() => {
    if (slideDone) {
      setSlideDone(false);
      setTimeID(
        setTimeout(() => {
          autoSlide();
          setSlideDone(true);
        }, 3000)
      );
    }

    return () => {
      if (timeID) clearTimeout(timeID);
    };
  }, [slideDone, activeIndex, directionForward]);

  const autoSlide = () => {
    if (directionForward) {
      if (activeIndex >= children.length - 1) {
        setDirectionForward(false);
        setActiveIndex(activeIndex - 1);
      } else {
        setActiveIndex(activeIndex + 1);
      }
    } else {
      if (activeIndex <= 0) {
        setDirectionForward(true);
        setActiveIndex(activeIndex + 1);
      } else {
        setActiveIndex(activeIndex - 1);
      }
    }
  };

  const slideNext = () => {
    if (activeIndex >= children.length - 1) {
      setDirectionForward(false);
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(activeIndex + 1);
    }
  };

  const slidePrev = () => {
    if (activeIndex <= 0) {
      setDirectionForward(true);
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(activeIndex - 1);
    }
  };

  const AutoPlayStop = () => {
    if (timeID !== null) {
      clearTimeout(timeID);
      setSlideDone(false);
    }
  };

  const AutoPlayStart = () => {
    if (!slideDone) {
      setSlideDone(true);
    }
  };

  return (
    <div className="slider">
      <div
        className="container__slider"
        onMouseEnter={AutoPlayStop}
        onMouseLeave={AutoPlayStart}
      >
        {children.map((item, index) => (
          <div
            className={"slider__item slider__item-active-" + (activeIndex + 1)}
            key={index}
          >
            {item}
          </div>
        ))}

        <button
          className="slider__btn-prev"
          onClick={(e) => {
            e.preventDefault();
            slidePrev();
          }}
        >
          <FaChevronLeft />
        </button>
        <button
          className="slider__btn-next"
          onClick={(e) => {
            e.preventDefault();
            slideNext();
          }}
        >
          <FaChevronRight />
        </button>
      </div>

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
              onClick={(e) => {
                e.preventDefault();
                setActiveIndex(index);
              }}
            >
              {title}
            </div>
          );
        })}
      </div>

      <div className="container__slider__links">
        {children.map((_, index) => (
          <button
            key={index}
            className={
              activeIndex === index
                ? "container__slider__links-small container__slider__links-small-active"
                : "container__slider__links-small"
            }
            onClick={(e) => {
              e.preventDefault();
              setActiveIndex(index);
            }}
          ></button>
        ))}
      </div>
    </div>
  );
}
