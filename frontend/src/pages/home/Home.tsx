import "./Home.css";
import Products from "./products/Products";
import Slider from "./slider/Slider";
import images from "./slider/image";
import TopSearch from "./topSearch/TopSearch";

export default function Home() {
  return (
    <div className="main-content">
      <Slider>
        {images.map((image, index) => (
          <img
            key={index}
            src={image.imgURL}
            alt={image.imgAlt}
            data-title={image.title}
          />
        ))}
      </Slider>

      <TopSearch />
      <Products />
    </div>
  );
}
