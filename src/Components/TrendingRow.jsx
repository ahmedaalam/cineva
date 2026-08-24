import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TrendingRow.css";

const TrendingRow = ({ movies = [] }) => {
  const rowRef = useRef(null);
  const navigate = useNavigate();
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

  const trendingList = movies.slice(0, 10);
  if (trendingList.length === 0) return null;

  return (
    <div className="netflix-top10-row" id="trending-row">
      <h2 className="top10-title">Top 10 Movies Today</h2>

      <div className="top10-slider-wrapper">
        {showLeftArrow && (
          <button
            className="top10-slider-arrow left"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

        <div className="top10-track" ref={rowRef} onScroll={checkScroll}>
          {trendingList.map((movie, index) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";

            return (
              <div
                className="top10-item"
                key={movie.id}
                onClick={() => navigate(`/moviepage/${movie.id}`)}
              >
                <div className="top10-rank-number">{index + 1}</div>
                <div className="top10-poster-box">
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="top10-poster-img"
                    loading="lazy"
                    draggable="false"
                  />
                  <div className="top10-badge">TOP 10</div>
                </div>
              </div>
            );
          })}
        </div>

        {showRightArrow && (
          <button
            className="top10-slider-arrow right"
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

export default TrendingRow;
