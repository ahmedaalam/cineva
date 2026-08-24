import { useRef, useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import "./MovieRow.css";

const MovieRow = ({ title, movies = [], id }) => {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    checkScroll();
  }, [movies]);

  const handleScroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 400);
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="netflix-row" id={id}>
      <div className="row-header">
        <h2 className="row-title">
          {title} <span className="row-explore-arrow">Explore All &gt;</span>
        </h2>
      </div>

      <div className="row-slider-wrapper">
        {showLeftArrow && (
          <button
            className="row-slider-arrow left"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

        <div className="row-cards-track" ref={rowRef} onScroll={checkScroll}>
          {movies.map((movie) => (
            <div className="row-card-item" key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            className="row-slider-arrow right"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;
